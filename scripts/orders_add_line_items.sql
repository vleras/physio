-- Multi-item cart support (run in Supabase SQL editor)

alter table public.orders
  add column if not exists line_items jsonb,
  add column if not exists order_note text;
