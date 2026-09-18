-- Add shipping / contact fields to existing orders table
-- Run in Supabase SQL editor (safe to re-run)

alter table public.orders
  add column if not exists customer_phone text,
  add column if not exists shipping_name text,
  add column if not exists shipping_line1 text,
  add column if not exists shipping_line2 text,
  add column if not exists shipping_city text,
  add column if not exists shipping_state text,
  add column if not exists shipping_postal_code text,
  add column if not exists shipping_country text;
