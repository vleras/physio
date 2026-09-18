-- Add quantity to orders (run in Supabase SQL editor)

alter table public.orders
  add column if not exists quantity integer not null default 1
  check (quantity > 0);
