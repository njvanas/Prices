/*
  # Add Sample Price History Data

  1. Purpose
     - Creates realistic price history data for existing products
     - Shows price fluctuations over the past 30 days
     - Enables price trend analysis and graphing

  2. Data Structure
     - Historical prices for each product across multiple retailers
     - Daily price variations showing market dynamics
     - Realistic price movements (increases, decreases, stability)

  3. Benefits
     - Enables price history graphs
     - Shows savings trends over time
     - Provides data for price alerts and notifications
*/

-- Generate price history for the past 30 days for all existing products
DO $$
DECLARE
    product_record RECORD;
    price_record RECORD;
    day_offset INTEGER;
    base_price NUMERIC;
    daily_variation NUMERIC;
    history_price NUMERIC;
    history_date TIMESTAMPTZ;
BEGIN
    -- Loop through all products that have current prices
    FOR product_record IN 
        SELECT DISTINCT p.id, p.name
        FROM products p
        INNER JOIN prices pr ON p.id = pr.product_id
    LOOP
        -- For each product, create history for each of its current prices
        FOR price_record IN
            SELECT pr.*, r.name as retailer_name
            FROM prices pr
            INNER JOIN retailers r ON pr.retailer_id = r.id
            WHERE pr.product_id = product_record.id
        LOOP
            base_price := price_record.price;
            
            -- Generate 30 days of price history
            FOR day_offset IN 1..30 LOOP
                history_date := NOW() - (day_offset || ' days')::INTERVAL;
                
                -- Create realistic price variations
                -- Prices generally trend downward over time with daily fluctuations
                daily_variation := (RANDOM() - 0.5) * 0.1; -- ±5% daily variation
                
                -- Add a slight downward trend over time (products get cheaper)
                history_price := base_price * (1 + daily_variation + (day_offset * 0.002));
                
                -- Ensure price doesn't go below 50% of current price or above 150%
                history_price := GREATEST(base_price * 0.5, LEAST(base_price * 1.5, history_price));
                
                -- Round to 2 decimal places
                history_price := ROUND(history_price, 2);
                
                -- Insert price history record
                INSERT INTO price_history (
                    product_id,
                    retailer_id,
                    price,
                    currency,
                    recorded_at
                ) VALUES (
                    product_record.id,
                    price_record.retailer_id,
                    history_price,
                    price_record.currency,
                    history_date
                );
            END LOOP;
        END LOOP;
        
        RAISE NOTICE 'Generated price history for product: %', product_record.name;
    END LOOP;
    
    RAISE NOTICE 'Price history generation completed successfully!';
END $$;