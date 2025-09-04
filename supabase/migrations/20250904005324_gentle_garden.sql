/*
  # Add featured deals tracking

  1. New Tables
    - `featured_deals`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `savings_amount` (numeric, dollar amount saved)
      - `savings_percentage` (numeric, percentage saved)
      - `lowest_price` (numeric, best price found)
      - `highest_price` (numeric, highest price found)
      - `deal_rank` (integer, ranking 1-10)
      - `last_updated` (timestamp)
      - `expires_at` (timestamp, when deal expires)

  2. Security
    - Enable RLS on `featured_deals` table
    - Add policy for public read access
    - Add policy for service role to manage deals

  3. Indexes
    - Index on deal_rank for fast retrieval
    - Index on last_updated for maintenance
*/

CREATE TABLE IF NOT EXISTS featured_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  savings_amount numeric(10,2) NOT NULL DEFAULT 0,
  savings_percentage numeric(5,2) NOT NULL DEFAULT 0,
  lowest_price numeric(10,2) NOT NULL,
  highest_price numeric(10,2) NOT NULL,
  deal_rank integer NOT NULL CHECK (deal_rank >= 1 AND deal_rank <= 10),
  last_updated timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint to ensure only one entry per product
ALTER TABLE featured_deals ADD CONSTRAINT featured_deals_product_id_key UNIQUE (product_id);

-- Add unique constraint for deal rank to ensure no duplicates
ALTER TABLE featured_deals ADD CONSTRAINT featured_deals_deal_rank_key UNIQUE (deal_rank);

-- Enable RLS
ALTER TABLE featured_deals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Featured deals are publicly readable"
  ON featured_deals
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

-- Service role can manage deals
CREATE POLICY "Service role can manage featured deals"
  ON featured_deals
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_featured_deals_rank ON featured_deals(deal_rank);
CREATE INDEX IF NOT EXISTS idx_featured_deals_updated ON featured_deals(last_updated);
CREATE INDEX IF NOT EXISTS idx_featured_deals_expires ON featured_deals(expires_at);
CREATE INDEX IF NOT EXISTS idx_featured_deals_product ON featured_deals(product_id);