import { supabase } from "@/lib/supabase";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "vso-clinic-default-secret-change-me";

export async function hashPassword(password: string): Promise<string> {
  const salt = await sha256(SECRET_KEY);
  return sha256(password + salt);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  const defaultPassword = process.env.ADMIN_PASSWORD;
  if (!defaultPassword) throw new Error("ADMIN_PASSWORD environment variable is not set");

  const { data, error } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "password_hash")
    .maybeSingle();

  if (!error && data?.value === hashed) return true;

  if (password === defaultPassword) {
    try {
      await updatePassword(defaultPassword);
    } catch {}
    return true;
  }

  return false;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const hashed = await hashPassword(newPassword);

  const { error } = await supabase
    .from("admin_config")
    .upsert({ key: "password_hash", value: hashed }, { onConflict: "key" });

  if (error) throw new Error("Failed to update password: " + error.message);
}

async function signToken(payload: string): Promise<string> {
  const signature = await sha256(payload + SECRET_KEY);
  return signature;
}

export async function createSession(): Promise<string> {
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${expires}`;
  const signature = await signToken(payload);
  return `${payload}.${signature}`;
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const payload = parts[0];
  const signature = parts[1];

  const expectedSignature = await signToken(payload);
  if (signature !== expectedSignature) return false;

  const expiresStr = payload.split(":")[1];
  if (!expiresStr) return false;

  const expires = parseInt(expiresStr, 10);
  return Date.now() < expires;
}

export async function destroySession(): Promise<void> {
  // Cookie-based session — nothing to clean up server-side
}

export { ADMIN_SESSION_COOKIE, SESSION_MAX_AGE };
