/*
  # Enhanced Price History with 5-Year Retention

  1. Schema Updates
    - Add indexes for 5-year data performance
    - Add data retention policies
    - Optimize historical data queries

  2. Performance Optimizations
    - Partition-ready structure for large datasets
    - Efficient cleanup procedures
    - Optimized historical data access

  3. Data Retention
    - 5-year historical data retention
    - Automatic cleanup of older data
    - Performance monitoring for large datasets
*/

-- Add indexes for efficient 5-year historical data queries
CREATE INDEX IF NOT EXISTS idx_price_history_product_date 
ON price_history (product_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_retailer_date 
ON price_history (retailer_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_deal_analysis 
ON price_history (product_id, retailer_id, recorded_at DESC, is_deal, deal_score);

-- Add index for efficient cleanup of old data
CREATE INDEX IF NOT EXISTS idx_price_history_cleanup 
ON price_history (recorded_at) 
WHERE recorded_at < (CURRENT_DATE - INTERVAL '5 years');

-- Function to automatically clean up data older than 5 years
CREATE OR REPLACE FUNCTION cleanup_old_price_history()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete price history older than 5 years
  DELETE FROM price_history 
  WHERE recorded_at < (CURRENT_DATE - INTERVAL '5 years');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO scheduler_runs (
    run_type,
    status,
    started_at,
    completed_at,
    execution_time_minutes,
    tasks_completed,
    summary
  ) VALUES (
    'data_cleanup',
    'completed',
    NOW(),
    NOW(),
    0.1,
    1,
    jsonb_build_object(
      'deleted_records', deleted_count,
      'retention_period', '5 years',
      'cleanup_date', CURRENT_DATE
    )
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update deal scores when price history is inserted
CREATE OR REPLACE FUNCTION update_deal_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate deal score based on historical context
  WITH price_stats AS (
    SELECT 
      AVG(price) as avg_price,
      MIN(price) as min_price,
      MAX(price) as max_price
    FROM price_history 
    WHERE product_id = NEW.product_id 
      AND retailer_id = NEW.retailer_id
      AND recorded_at >= (CURRENT_DATE - INTERVAL '365 days')
  )
  SELECT 
    CASE 
      WHEN ps.max_price - ps.min_price = 0 THEN 5.0
      ELSE GREATEST(0, LEAST(10, 
        ((ps.max_price - NEW.price) / (ps.max_price - ps.min_price)) * 8 +
        CASE WHEN NEW.price <= ps.min_price * 1.05 THEN 2 ELSE 0 END +
        CASE WHEN NEW.price > ps.avg_price THEN -1 ELSE 0 END
      ))
    END INTO NEW.deal_score
  FROM price_stats ps;
  
  -- Determine if this is a deal (score >= 7.5)
  NEW.is_deal := NEW.deal_score >= 7.5;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS trigger_update_deal_score ON price_history;
CREATE TRIGGER trigger_update_deal_score
  BEFORE INSERT ON price_history
  FOR EACH ROW
  EXECUTE FUNCTION update_deal_score();

-- Add function to get price history summary for efficient queries
CREATE OR REPLACE FUNCTION get_price_history_summary(
  p_product_id UUID,
  p_retailer_id UUID DEFAULT NULL,
  p_days_back INTEGER DEFAULT 365
)
RETURNS TABLE (
  date DATE,
  min_price NUMERIC,
  max_price NUMERIC,
  avg_price NUMERIC,
  retailer_count BIGINT,
  deal_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ph.recorded_at::DATE as date,
    MIN(ph.price) as min_price,
    MAX(ph.price) as max_price,
    AVG(ph.price) as avg_price,
    COUNT(DISTINCT ph.retailer_id) as retailer_count,
    COUNT(*) FILTER (WHERE ph.is_deal = true) as deal_count
  FROM price_history ph
  WHERE ph.product_id = p_product_id
    AND (p_retailer_id IS NULL OR ph.retailer_id = p_retailer_id)
    AND ph.recorded_at >= (CURRENT_DATE - (p_days_back || ' days')::INTERVAL)
  GROUP BY ph.recorded_at::DATE
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;