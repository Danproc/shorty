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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const email = "hello@thenorthern-web.co.uk";

async function checkUser() {
  console.log(`\n🔍 Checking subscription status for: ${email}\n`);

  // Get user by email from auth
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error("❌ Error fetching users:", authError);
    return;
  }

  const authUser = authData.users.find(u => u.email === email);

  if (!authUser) {
    console.log("❌ No auth user found for this email");
    return;
  }

  console.log("✅ Auth user found:");
  console.log(`   ID: ${authUser.id}`);
  console.log(`   Email: ${authUser.email}`);
  console.log(`   Created: ${authUser.created_at}\n`);

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    console.error("❌ Error fetching profile:", profileError);
    return;
  }

  if (!profile) {
    console.log("❌ No profile found");
    return;
  }

  console.log("📋 Profile details:");
  console.log(`   ID: ${profile.id}`);
  console.log(`   Email: ${profile.email}`);
  console.log(`   Has Access: ${profile.has_access}`);
  console.log(`   Customer ID: ${profile.customer_id || "None"}`);
  console.log(`   Price ID: ${profile.price_id || "None"}`);
  console.log(`   Created: ${profile.created_at}`);
  console.log(`   Updated: ${profile.updated_at}\n`);

  if (profile.has_access) {
    console.log("✅ User HAS subscription access!");
  } else {
    console.log("❌ User DOES NOT have subscription access");
    console.log("   This means the Stripe webhook didn't process correctly");
  }
}

checkUser().then(() => {
  console.log("\n✅ Check complete\n");
  process.exit(0);
}).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
