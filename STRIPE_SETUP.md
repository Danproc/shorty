# Stripe Configuration Guide

This guide will help you configure Stripe for your subscription-based dashboard access.

## Overview

Your application now supports a **freemium model**:
- **Free tier**: Users can generate QR codes, shorten URLs, and convert markdown files without any subscription
- **Premium tier**: Users subscribe to access their personal dashboard with analytics, asset management, and detailed statistics

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Supabase project set up with the required migrations

## Step-by-Step Setup

### 1. Create a Stripe Account

1. Go to https://stripe.com and create an account
2. Complete the onboarding process
3. Start in **Test mode** for development

### 2. Get Your API Keys

1. Navigate to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Keep this window open - you'll need it in step 5

### 3. Create Subscription Products

1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**

#### Product 1: Pro Plan
- **Name**: Pro
- **Description**: Perfect for individuals and small teams
- **Pricing model**: Recurring
- **Price**: $9/month (or your preferred amount)
- **Billing period**: Monthly
- Click **"Save product"**
- **Copy the Price ID** (starts with `price_`) - you'll need this later

#### Product 2: Business Plan
- **Name**: Business
- **Description**: For growing businesses and teams
- **Pricing model**: Recurring
- **Price**: $19/month (or your preferred amount)
- **Billing period**: Monthly
- Click **"Save product"**
- **Copy the Price ID** (starts with `price_`) - you'll need this later

### 4. Set Up Webhooks

Webhooks allow Stripe to notify your application when subscriptions are created, updated, or canceled.

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**:
   - Development: `http://localhost:3000/api/webhook/stripe` (you'll need to use Stripe CLI)
   - Production: `https://yourdomain.com/api/webhook/stripe`

4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.paid`
   - `invoice.payment_failed`

5. Click **"Add endpoint"**
6. **Copy the Signing secret** (starts with `whsec_`)

#### For Local Development with Webhooks

If you want to test webhooks locally, you'll need to use the Stripe CLI:

```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# This will output a webhook signing secret (whsec_...)
# Use this in your .env.local for local development
```

### 5. Update Your Environment Variables

Create or update your `.env.local` file in the root of your project:

```bash
# Copy from .env.example if you haven't already
cp .env.example .env.local
```

Add your Stripe keys:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 6. Update config.js with Your Price IDs

Open `config.js` and update the price IDs with the ones you copied from Stripe:

```javascript
stripe: {
  plans: [
    {
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_YOUR_PRO_PRICE_ID"    // Replace this
          : "price_YOUR_PROD_PRO_PRICE", // And this for production
      name: "Pro",
      // ... rest of config
    },
    {
      isFeatured: true,
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_YOUR_BUSINESS_PRICE_ID"    // Replace this
          : "price_YOUR_PROD_BUSINESS_PRICE", // And this for production
      name: "Business",
      // ... rest of config
    },
  ],
},
```

### 7. Run Database Migrations

Make sure the profiles table is created in your Supabase database:

```bash
# If using Supabase CLI
supabase migration up
```

Or manually run the migration at `supabase/migrations/007_create_profiles.sql` in your Supabase SQL editor.

### 8. Test Your Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. If testing webhooks locally, start the Stripe CLI listener in another terminal:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. Test the flow:
   - Go to http://localhost:3000
   - Sign up for an account
   - Try to access the dashboard - you should be redirected to `/pricing`
   - Click on a subscription plan
   - Use Stripe's test card: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits
   - Complete the checkout
   - Verify you're redirected and can now access the dashboard

### 9. Production Setup

When you're ready to go live:

1. Switch to **Live mode** in Stripe dashboard (toggle in top right)
2. Create the same products in live mode
3. Set up webhooks for your production domain
4. Update your production environment variables:
   - `STRIPE_SECRET_KEY` (live key starts with `sk_live_`)
   - `STRIPE_WEBHOOK_SECRET` (live webhook secret)
5. Update `config.js` production price IDs

## Troubleshooting

### "Neither apiKey nor config.authenticator provided" Error

This error means the `STRIPE_SECRET_KEY` is not set in your environment variables.

**Solution**:
1. Check your `.env.local` file exists and contains `STRIPE_SECRET_KEY`
2. Restart your development server after adding the key
3. Verify the key starts with `sk_test_` (for test mode) or `sk_live_` (for live mode)

### Webhooks not working

1. Verify the webhook endpoint is accessible
2. Check the webhook signing secret is correct
3. For local development, make sure Stripe CLI is running
4. Check Stripe dashboard for webhook delivery attempts and errors

### User can't access dashboard after payment

1. Check the webhook was received (Stripe Dashboard → Webhooks → [your endpoint] → Events)
2. Verify the profiles table has the user's record with `has_access: true`
3. Check Supabase logs for any errors during profile update

## Support

For Stripe-specific issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For application issues:
- Check the browser console for errors
- Check server logs for errors
- Verify all environment variables are set correctly

## How It Works

### User Flow

1. **Free User**:
   - Can access `/qr-generator`, `/shorten`, `/markdown`
   - Creates QR codes and URLs without signing in
   - All generated assets work forever

2. **Signed-in User (No Subscription)**:
   - Can still use all free features
   - Attempting to access `/dashboard` redirects to `/pricing`
   - Can view subscription plans and subscribe

3. **Subscribed User**:
   - Can access `/dashboard` and all sub-pages
   - Can view analytics and manage all their assets
   - Can manage billing at `/dashboard/billing`

### Technical Flow

1. **Subscription Created**:
   - User completes checkout on Stripe
   - Stripe sends `checkout.session.completed` webhook
   - Your app creates/updates profile with `has_access: true`
   - User can now access dashboard

2. **Subscription Canceled**:
   - User cancels via billing portal or subscription expires
   - Stripe sends `customer.subscription.deleted` webhook
   - Your app updates profile with `has_access: false`
   - User can no longer access dashboard (redirected to pricing)

3. **Dashboard Access Check**:
   - Dashboard layout checks user authentication (Supabase)
   - Then checks subscription status (profiles table)
   - Redirects to pricing if no active subscription
   - Renders dashboard if subscription is active

## Next Steps

Once Stripe is configured, you might want to:

1. Customize the pricing page design and copy
2. Add more subscription tiers
3. Implement usage-based billing
4. Add promotional codes
5. Customize the billing portal
6. Set up email notifications for subscription events
