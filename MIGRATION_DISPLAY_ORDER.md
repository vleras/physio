# Migration: Add display_order Column

If your `Products` table doesn't have a `display_order` column yet, you need to add it to enable product ordering persistence.

## SQL Migration

Run this SQL in your Supabase SQL editor:

```sql
-- Add display_order column to Products table
ALTER TABLE "Products" 
ADD COLUMN IF NOT EXISTS "display_order" INTEGER;

-- Optional: Initialize display_order for existing products based on their current id order
UPDATE "Products"
SET "display_order" = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_number
  FROM "Products"
) AS subquery
WHERE "Products".id = subquery.id;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS "idx_products_display_order" ON "Products" ("display_order");
```

## What This Does

1. Adds a `display_order` column to store the custom order of products
2. Optionally initializes existing products with display_order values based on their current id order
3. Creates an index for faster sorting queries

After running this migration, the drag-and-drop reordering on the dashboard will persist to the database, and both the dashboard and catalog pages will display products in the saved order.

