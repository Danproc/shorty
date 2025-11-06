import Stripe from "stripe";
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
const customerId = "cus_TN91JwkG7Xx3LR";

async function testPortal() {
  console.log("\n🧪 Testing Stripe Customer Portal creation...\n");

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://cuer.io/dashboard/billing",
    });

    console.log("✅ Portal session created successfully!");
    console.log(`   Portal URL: ${portalSession.url}\n`);
    console.log("✅ Billing portal is configured correctly in Stripe\n");
  } catch (error) {
    console.error("❌ Error creating portal session:", error.message);

    if (error.message.includes("customer portal")) {
      console.log("\n⚠️  The Stripe Customer Portal is not configured!");
      console.log("\n📋 To fix this:");
      console.log("   1. Go to https://dashboard.stripe.com/settings/billing/portal");
      console.log("   2. Click 'Activate' or configure your portal settings");
      console.log("   3. Set up which features customers can manage");
      console.log("   4. Save your changes\n");
    }
  }
}

testPortal().then(() => {
  process.exit(0);
}).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
