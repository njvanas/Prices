/*
  # Add scheduler tracking and enhanced price history

  1. New Tables
    - `scheduler_runs` - Track daily scheduler execution history
    - `product_discovery_log` - Log new products discovered each day
    - Enhanced price_history with more metadata

  2. Indexes
    - Performance indexes for historical queries
    - Scheduler tracking indexes

  3. Security
    - RLS policies for new tables
    - Service role access for automated systems
*/

-- Scheduler execution tracking
CREATE TABLE IF NOT EXISTS scheduler_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type text NOT NULL, -- 'daily', 'weekly', 'manual'
  status text NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  execution_time_minutes numeric(8,2),
  tasks_completed integer DEFAULT 0,
  tasks_failed integer DEFAULT 0,
  error_details text,
  summary jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Product discovery logging
CREATE TABLE IF NOT EXISTS product_discovery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  discovery_date date DEFAULT CURRENT_DATE,
  source text NOT NULL, -- 'api', 'scraper', 'manual'
  category_id uuid REFERENCES categories(id),
  country_code text REFERENCES countries(code),
  initial_price numeric(10,2),
  initial_retailer_id uuid REFERENCES retailers(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enhanced price tracking metadata
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_history' AND column_name = 'price_change_percent'
  ) THEN
    ALTER TABLE price_history ADD COLUMN price_change_percent numeric(5,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_history' AND column_name = 'is_deal'
  ) THEN
    ALTER TABLE price_history ADD COLUMN is_deal boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_history' AND column_name = 'deal_score'
  ) THEN
    ALTER TABLE price_history ADD COLUMN deal_score numeric(3,1) DEFAULT 0;
  END IF;
END $$;

-- Performance indexes for historical queries
CREATE INDEX IF NOT EXISTS idx_scheduler_runs_type_status ON scheduler_runs(run_type, status);
CREATE INDEX IF NOT EXISTS idx_scheduler_runs_started_at ON scheduler_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_product_discovery_date ON product_discovery_log(discovery_date);
CREATE INDEX IF NOT EXISTS idx_product_discovery_category ON product_discovery_log(category_id);
CREATE INDEX IF NOT EXISTS idx_product_discovery_country ON product_discovery_log(country_code);
CREATE INDEX IF NOT EXISTS idx_price_history_deal_score ON price_history(deal_score) WHERE is_deal = true;
CREATE INDEX IF NOT EXISTS idx_price_history_change_percent ON price_history(price_change_percent);

-- RLS policies
ALTER TABLE scheduler_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_discovery_log ENABLE ROW LEVEL SECURITY;

-- Service role can manage all scheduler data
CREATE POLICY "Service role can manage scheduler runs"
  ON scheduler_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage discovery log"
  ON product_discovery_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public can read scheduler status (for monitoring)
CREATE POLICY "Public can read scheduler status"
  ON scheduler_runs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read discovery stats"
  ON product_discovery_log
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to calculate deal scores based on historical data
CREATE OR REPLACE FUNCTION calculate_deal_score(
  current_price numeric,
  historical_avg numeric,
  historical_min numeric,
  historical_max numeric
) RETURNS numeric AS $$
BEGIN
  -- Deal score from 0-10 based on how good the current price is
  -- 10 = best price ever, 0 = worst price ever
  
  IF historical_max <= historical_min THEN
    RETURN 5.0; -- No price variation, neutral score
  END IF;
  
  -- Calculate position in price range (0 = highest, 1 = lowest)
  DECLARE
    price_position numeric := (historical_max - current_price) / (historical_max - historical_min);
  BEGIN
    -- Convert to 0-10 scale with bonus for being below average
    IF current_price <= historical_avg THEN
      RETURN LEAST(10.0, 5.0 + (price_position * 5.0) + 1.0);
    ELSE
      RETURN price_position * 5.0;
    END IF;
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate deal scores when price history is inserted
CREATE OR REPLACE FUNCTION update_deal_score() RETURNS TRIGGER AS $$
BEGIN
  -- Calculate historical stats for this product-retailer combination
  WITH price_stats AS (
    SELECT 
      AVG(price) as avg_price,
      MIN(price) as min_price,
      MAX(price) as max_price
    FROM price_history 
    WHERE product_id = NEW.product_id 
    AND retailer_id = NEW.retailer_id
    AND recorded_at >= NOW() - INTERVAL '90 days'
  )
  SELECT 
    calculate_deal_score(NEW.price, avg_price, min_price, max_price),
    CASE WHEN NEW.price <= avg_price * 0.9 THEN true ELSE false END
  INTO NEW.deal_score, NEW.is_deal
  FROM price_stats;
  
  -- Calculate price change percentage from previous record
  WITH prev_price AS (
    SELECT price 
    FROM price_history 
    WHERE product_id = NEW.product_id 
    AND retailer_id = NEW.retailer_id 
    AND recorded_at < NEW.recorded_at
    ORDER BY recorded_at DESC 
    LIMIT 1
  )
  SELECT 
    CASE 
      WHEN prev_price.price > 0 THEN 
        ((NEW.price - prev_price.price) / prev_price.price) * 100
      ELSE 0 
    END
  INTO NEW.price_change_percent
  FROM prev_price;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic deal score calculation
DROP TRIGGER IF EXISTS trigger_update_deal_score ON price_history;
CREATE TRIGGER trigger_update_deal_score
  BEFORE INSERT ON price_history
  FOR EACH ROW
  EXECUTE FUNCTION update_deal_score();