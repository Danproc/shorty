import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/libs/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { SubscriptionRenewalEmail } from "@/emails/SubscriptionRenewalEmail";
import { SubscriptionCancelledEmail } from "@/emails/SubscriptionCancelledEmail";

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing required Stripe environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let eventType;
  let event;

  // Create a private supabase client using the secret service_role API key
  // Disable realtime to reduce Edge Runtime warnings
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
      realtime: { disabled: true }
    }
  );

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        console.log("🔔 Webhook received: checkout.session.completed");
        const stripeObject = event.data.object;
        console.log("📋 Session ID:", stripeObject.id);

        const session = await findCheckoutSession(stripeObject.id);
        console.log("✅ Retrieved checkout session from Stripe");

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;
        console.log("🔑 User ID from client_reference_id:", userId);
        console.log("💳 Customer ID:", customerId);
        console.log("💰 Price ID:", priceId);

        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        const customer = await stripe.customers.retrieve(customerId);
        console.log("👤 Customer email:", customer.email);

        if (!plan) {
          console.error("❌ Plan not found for priceId:", priceId);
          break;
        }
        console.log("📦 Plan found:", plan.name);

        let user;
        if (!userId) {
          console.log("⚠️  No userId in client_reference_id, checking for existing user by email");
          // check if user already exists
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", customer.email)
            .single();
          if (profile) {
            console.log("✅ Found existing profile for email:", customer.email);
            user = profile;
          } else {
            console.log("🆕 Creating new auth user for email:", customer.email);
            // create a new user using supabase auth admin
            const { data, error: authError } = await supabase.auth.admin.createUser({
              email: customer.email,
            });

            if (authError) {
              console.error("❌ Failed to create auth user:", authError);
              throw authError;
            }

            user = data?.user;
            console.log("✅ Created new auth user with ID:", user?.id);

            if (user?.id) {
              console.log("⏳ Waiting 100ms for profile trigger to complete...");
              await new Promise(resolve => setTimeout(resolve, 100));

              const { data: existingProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

              if (existingProfile) {
                console.log("✅ Profile auto-created by trigger");
                user = existingProfile;
              } else {
                console.log("⚠️  Profile not found after trigger, will be created in upsert");
              }
            }
          }
        } else {
          console.log("🔍 Looking up user by ID:", userId);
          // find user by ID
          const { data: profile, error: lookupError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (lookupError) {
            console.error("❌ Error looking up profile:", lookupError);
          }

          user = profile;
          if (user) {
            console.log("✅ Found user profile for ID:", userId);
          } else {
            console.log("⚠️  No profile found for user ID:", userId);
          }
        }

        if (!user?.id) {
          console.error("❌ User ID is null, cannot create/update profile");
          throw new Error("User ID is required for profile creation");
        }

        console.log("💾 Upserting profile with has_access: true for user:", user.id);
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: customer.email,
            customer_id: customerId,
            price_id: priceId,
            has_access: true,
          });

        if (error) {
          console.error("❌ Failed to upsert profile:", error);
          throw error;
        }

        console.log("🎉 SUCCESS! Profile updated with subscription access for user:", user.id);
        console.log("✅ User should now have access to dashboard");

        // Send welcome email
        try {
          const emailContent = WelcomeEmail({
            userName: customer.name || customer.email.split('@')[0],
            email: customer.email,
          });

          await sendEmail({
            to: customer.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });

          console.log("📧 Welcome email sent successfully to:", customer.email);
        } catch (e) {
          console.error("📧 Email issue:", e?.message);
        }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        console.log("🔔 Webhook received: customer.subscription.deleted");
        const stripeObject = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );
        console.log("🚫 Revoking access for customer:", subscription.customer);

        const { error } = await supabase
          .from("profiles")
          .update({ has_access: false })
          .eq("customer_id", subscription.customer);

        if (error) {
          console.error("❌ Failed to revoke access:", error);
        } else {
          console.log("✅ Access revoked successfully");
        }

        // Send cancellation email
        try {
          const customer = await stripe.customers.retrieve(subscription.customer);

          // Get the end date of the subscription
          const endDate = new Date(subscription.current_period_end * 1000);
          const formattedEndDate = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const emailContent = SubscriptionCancelledEmail({
            userName: customer.name || customer.email.split('@')[0],
            email: customer.email,
            endDate: formattedEndDate,
          });

          await sendEmail({
            to: customer.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });

          console.log("📧 Cancellation email sent successfully to:", customer.email);
        } catch (e) {
          console.error("📧 Email issue:", e?.message);
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        console.log("🔔 Webhook received: invoice.paid");
        const stripeObject = event.data.object;
        const priceId = stripeObject.lines.data[0].price.id;
        const customerId = stripeObject.customer;
        console.log("💳 Customer ID:", customerId);
        console.log("💰 Price ID:", priceId);

        // Find profile where customer_id equals the customerId (in table called 'profiles')
        const { data: profile, error: lookupError } = await supabase
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (lookupError) {
          console.error("❌ Error finding profile:", lookupError);
          break;
        }

        if (!profile) {
          console.error("❌ No profile found for customer:", customerId);
          break;
        }

        console.log("✅ Found profile for user:", profile.id);

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (profile.price_id !== priceId) {
          console.log("⚠️  Price ID mismatch. Profile:", profile.price_id, "Invoice:", priceId);
          break;
        }

        console.log("💾 Granting access for recurring payment");
        // Grant the profile access to your product. It's a boolean in the database, but could be a number of credits, etc...
        const { error } = await supabase
          .from("profiles")
          .update({ has_access: true })
          .eq("customer_id", customerId);

        if (error) {
          console.error("❌ Failed to grant access:", error);
        } else {
          console.log("✅ Access granted successfully for recurring payment");
        }

        // Send renewal email
        try {
          const customer = await stripe.customers.retrieve(customerId);
          const amountPaid = (stripeObject.amount_paid / 100).toFixed(2);

          // Calculate next billing date (approximately 1 month from now)
          const nextBillingDate = new Date();
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          const formattedDate = nextBillingDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const emailContent = SubscriptionRenewalEmail({
            userName: customer.name || customer.email.split('@')[0],
            email: customer.email,
            amount: amountPaid,
            nextBillingDate: formattedDate,
          });

          await sendEmail({
            to: customer.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });

          console.log("📧 Renewal email sent successfully to:", customer.email);
        } catch (e) {
          console.error("📧 Email issue:", e?.message);
        }

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
