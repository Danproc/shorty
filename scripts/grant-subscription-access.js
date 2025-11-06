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
const userId = "a0b7b5af-5beb-404b-957f-33baa6b1e348";

async function grantAccess() {
  console.log(`\n🔧 Granting subscription access to: ${email}\n`);

  // Create/update profile with has_access = true
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: email,
      has_access: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    })
    .select();

  if (error) {
    console.error("❌ Error granting access:", error);
    return;
  }

  console.log("✅ Successfully granted subscription access!");
  console.log("📋 Profile details:", data);
  console.log("\n✅ User should now be able to access the dashboard at /dashboard\n");
}

grantAccess().then(() => {
  process.exit(0);
}).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
