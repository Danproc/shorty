import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=#]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const email = "hello@thenorthern-web.co.uk";
const userId = "a0b7b5af-5beb-404b-957f-33baa6b1e348";

async function linkStripeCustomer() {
  console.log(`\n🔍 Looking up Stripe customer for: ${email}\n`);

  // Search for customer in Stripe
  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  });

  if (customers.data.length === 0) {
    console.log("❌ No Stripe customer found for this email");
    console.log("   User may not have completed a payment yet");
    return;
  }

  const customer = customers.data[0];
  console.log("✅ Stripe customer found:");
  console.log(`   Customer ID: ${customer.id}`);
  console.log(`   Email: ${customer.email}`);
  console.log(`   Created: ${new Date(customer.created * 1000).toISOString()}\n`);

  // Check for active subscriptions
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1
  });

  if (subscriptions.data.length > 0) {
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    console.log("✅ Active subscription found:");
    console.log(`   Subscription ID: ${subscription.id}`);
    console.log(`   Price ID: ${priceId}`);
    console.log(`   Status: ${subscription.status}\n`);

    // Update profile with customer_id and price_id
    const { data, error } = await supabase
      .from("profiles")
      .update({
        customer_id: customer.id,
        price_id: priceId,
        has_access: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("❌ Error updating profile:", error);
      return;
    }

    console.log("✅ Successfully linked Stripe customer to profile!");
    console.log("📋 Updated profile:", data);
  } else {
    console.log("⚠️  No active subscriptions found");
    console.log("   Linking customer ID only...\n");

    // Update profile with just customer_id
    const { data, error } = await supabase
      .from("profiles")
      .update({
        customer_id: customer.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("❌ Error updating profile:", error);
      return;
    }

    console.log("✅ Linked customer ID to profile");
    console.log("📋 Updated profile:", data);
  }

  console.log("\n✅ User should now be able to access the billing portal\n");
}

linkStripeCustomer().then(() => {
  process.exit(0);
}).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
