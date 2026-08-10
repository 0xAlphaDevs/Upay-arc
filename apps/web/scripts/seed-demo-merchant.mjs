import { createClient } from "@supabase/supabase-js";
import { randomBytes, createHash } from "crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const db = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

function hash(key) {
  return createHash("sha256").update(key).digest("hex");
}

const pk = `pk_test_${randomBytes(12).toString("hex")}`;
const sk = `sk_test_${randomBytes(12).toString("hex")}`;

const { data: merchant, error: merchantError } = await db
  .from("merchants")
  .insert({
    name: "Pixel Threads",
    email: "founder@demostore.xyz",
    settlement_address: "0xA1c4d2000000000000000000000000E9b27F",
    settlement_token: "USDC",
  })
  .select("id")
  .single();

if (merchantError || !merchant) {
  console.error("Failed to insert merchant:", merchantError);
  process.exit(1);
}

const { error: keysError } = await db.from("api_keys").insert([
  { merchant_id: merchant.id, key_prefix: pk.slice(0, 16), key_hash: hash(pk), key_plaintext: pk, type: "publishable" },
  { merchant_id: merchant.id, key_prefix: sk.slice(0, 16), key_hash: hash(sk), type: "secret" },
]);

if (keysError) {
  console.error("Failed to insert api keys:", keysError);
  process.exit(1);
}

console.log(JSON.stringify({ merchant_id: merchant.id, publishable_key: pk, secret_key: sk }, null, 2));
