/*
  # Populate Sample Data for Price Comparison

  1. Sample Products
    - Electronics (smartphones, laptops, headphones)
    - Home & Garden items
    - Fashion accessories
    - Sports equipment
    
  2. Sample Prices
    - Multiple retailers per product
    - Realistic price variations
    - Different availability statuses
    
  3. Sample Price History
    - 30 days of historical data
    - Natural price fluctuations
    - Trending patterns
*/

-- Insert sample products
INSERT INTO products (id, name, description, brand, model, category_id, image_url, specifications) VALUES
-- Electronics
('550e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro Max', 'Latest flagship smartphone with titanium design and advanced camera system', 'Apple', 'iPhone 15 Pro Max', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400', '{"storage": "256GB", "color": "Natural Titanium", "display": "6.7-inch Super Retina XDR", "camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto"}'),
('550e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen and AI features', 'Samsung', 'Galaxy S24 Ultra', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400', '{"storage": "256GB", "color": "Titanium Black", "display": "6.8-inch Dynamic AMOLED 2X", "camera": "200MP Main + 50MP Periscope Telephoto"}'),
('550e8400-e29b-41d4-a716-446655440003', 'MacBook Pro 14-inch M3', 'Professional laptop with M3 chip for creative professionals', 'Apple', 'MacBook Pro 14-inch', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400', '{"processor": "Apple M3", "memory": "16GB", "storage": "512GB SSD", "display": "14.2-inch Liquid Retina XDR"}'),
('550e8400-e29b-41d4-a716-446655440004', 'Dell XPS 13 Plus', 'Ultra-portable Windows laptop with premium design', 'Dell', 'XPS 13 Plus', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400', '{"processor": "Intel Core i7-1360P", "memory": "16GB", "storage": "512GB SSD", "display": "13.4-inch OLED"}'),
('550e8400-e29b-41d4-a716-446655440005', 'Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 'Sony', 'WH-1000XM5', (SELECT id FROM categories WHERE slug = 'headphones' LIMIT 1), 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400', '{"type": "Over-ear", "connectivity": "Bluetooth 5.2", "battery": "30 hours", "noise_canceling": "Yes"}'),
('550e8400-e29b-41d4-a716-446655440006', 'AirPods Pro 2nd Gen', 'Premium wireless earbuds with spatial audio', 'Apple', 'AirPods Pro', (SELECT id FROM categories WHERE slug = 'headphones' LIMIT 1), 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400', '{"type": "In-ear", "connectivity": "Bluetooth 5.3", "battery": "6 hours + 24 hours case", "noise_canceling": "Yes"}'),

-- Home & Garden
('550e8400-e29b-41d4-a716-446655440007', 'Dyson V15 Detect', 'Powerful cordless vacuum with laser dust detection', 'Dyson', 'V15 Detect', (SELECT id FROM categories WHERE slug = 'home-appliances' LIMIT 1), 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400', '{"type": "Cordless Stick", "battery": "60 minutes", "bin_capacity": "0.77L", "weight": "3.1kg"}'),
('550e8400-e29b-41d4-a716-446655440008', 'Instant Pot Duo 7-in-1', 'Multi-functional electric pressure cooker', 'Instant Pot', 'Duo 7-in-1', (SELECT id FROM categories WHERE slug = 'home-appliances' LIMIT 1), 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400', '{"capacity": "6 Quart", "functions": "7-in-1", "material": "Stainless Steel", "programs": "13 Smart Programs"}'),

-- Fashion
('550e8400-e29b-41d4-a716-446655440009', 'Nike Air Max 270', 'Comfortable lifestyle sneakers with Max Air cushioning', 'Nike', 'Air Max 270', (SELECT id FROM categories WHERE slug = 'shoes' LIMIT 1), 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400', '{"size": "US 10", "color": "Black/White", "material": "Mesh and synthetic", "cushioning": "Max Air"}'),
('550e8400-e29b-41d4-a716-446655440010', 'Adidas Ultraboost 22', 'High-performance running shoes with Boost technology', 'Adidas', 'Ultraboost 22', (SELECT id FROM categories WHERE slug = 'shoes' LIMIT 1), 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', '{"size": "US 10", "color": "Core Black", "material": "Primeknit", "technology": "Boost midsole"}'),

-- Sports & Fitness
('550e8400-e29b-41d4-a716-446655440011', 'Peloton Bike+', 'Interactive exercise bike with rotating screen', 'Peloton', 'Bike+', (SELECT id FROM categories WHERE slug = 'fitness' LIMIT 1), 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400', '{"resistance": "Magnetic", "screen": "23.8-inch HD touchscreen", "connectivity": "Wi-Fi, Bluetooth", "weight": "140 lbs"}'),
('550e8400-e29b-41d4-a716-446655440012', 'Yeti Rambler 30oz', 'Insulated stainless steel tumbler', 'Yeti', 'Rambler 30oz', (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1), 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=400', '{"capacity": "30oz", "material": "18/8 Stainless Steel", "insulation": "Double-wall vacuum", "lid": "MagSlider"}')

ON CONFLICT (id) DO NOTHING;

-- Insert sample prices for US retailers
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
-- iPhone 15 Pro Max prices
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 1199.00, 'USD', 'https://amazon.com/iphone-15-pro-max', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 1199.00, 'USD', 'https://bestbuy.com/iphone-15-pro-max', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 1249.99, 'USD', 'https://target.com/iphone-15-pro-max', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM retailers WHERE name = 'Walmart' LIMIT 1), 1189.00, 'USD', 'https://walmart.com/iphone-15-pro-max', 'in_stock', now()),

-- Samsung Galaxy S24 Ultra prices
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 1299.99, 'USD', 'https://amazon.com/galaxy-s24-ultra', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 1299.99, 'USD', 'https://bestbuy.com/galaxy-s24-ultra', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 1349.99, 'USD', 'https://target.com/galaxy-s24-ultra', 'limited_stock', now()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM retailers WHERE name = 'Newegg' LIMIT 1), 1279.99, 'USD', 'https://newegg.com/galaxy-s24-ultra', 'in_stock', now()),

-- MacBook Pro prices
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 1999.00, 'USD', 'https://amazon.com/macbook-pro-14', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 1999.00, 'USD', 'https://bestbuy.com/macbook-pro-14', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM retailers WHERE name = 'Costco' LIMIT 1), 1899.99, 'USD', 'https://costco.com/macbook-pro-14', 'in_stock', now()),

-- Dell XPS 13 prices
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 1299.99, 'USD', 'https://amazon.com/dell-xps-13', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 1349.99, 'USD', 'https://bestbuy.com/dell-xps-13', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM retailers WHERE name = 'Newegg' LIMIT 1), 1279.99, 'USD', 'https://newegg.com/dell-xps-13', 'in_stock', now()),

-- Sony WH-1000XM5 prices
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 399.99, 'USD', 'https://amazon.com/sony-wh1000xm5', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 399.99, 'USD', 'https://bestbuy.com/sony-wh1000xm5', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 429.99, 'USD', 'https://target.com/sony-wh1000xm5', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM retailers WHERE name = 'Walmart' LIMIT 1), 379.00, 'USD', 'https://walmart.com/sony-wh1000xm5', 'in_stock', now()),

-- AirPods Pro prices
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 249.00, 'USD', 'https://amazon.com/airpods-pro-2', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 249.99, 'USD', 'https://bestbuy.com/airpods-pro-2', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 249.99, 'USD', 'https://target.com/airpods-pro-2', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM retailers WHERE name = 'Costco' LIMIT 1), 229.99, 'USD', 'https://costco.com/airpods-pro-2', 'in_stock', now()),

-- Dyson V15 prices
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 749.99, 'USD', 'https://amazon.com/dyson-v15-detect', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 749.99, 'USD', 'https://bestbuy.com/dyson-v15-detect', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 799.99, 'USD', 'https://target.com/dyson-v15-detect', 'limited_stock', now()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM retailers WHERE name = 'Home Depot' LIMIT 1), 729.99, 'USD', 'https://homedepot.com/dyson-v15-detect', 'in_stock', now()),

-- Instant Pot prices
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 99.95, 'USD', 'https://amazon.com/instant-pot-duo', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 119.99, 'USD', 'https://target.com/instant-pot-duo', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM retailers WHERE name = 'Walmart' LIMIT 1), 89.00, 'USD', 'https://walmart.com/instant-pot-duo', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM retailers WHERE name = 'Costco' LIMIT 1), 79.99, 'USD', 'https://costco.com/instant-pot-duo', 'in_stock', now()),

-- Nike Air Max 270 prices
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 150.00, 'USD', 'https://amazon.com/nike-air-max-270', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 149.99, 'USD', 'https://target.com/nike-air-max-270', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM retailers WHERE name = 'Walmart' LIMIT 1), 139.99, 'USD', 'https://walmart.com/nike-air-max-270', 'in_stock', now()),

-- Adidas Ultraboost prices
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 180.00, 'USD', 'https://amazon.com/adidas-ultraboost-22', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 189.99, 'USD', 'https://target.com/adidas-ultraboost-22', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 179.99, 'USD', 'https://bestbuy.com/adidas-ultraboost-22', 'limited_stock', now()),

-- Peloton Bike+ prices
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 2495.00, 'USD', 'https://amazon.com/peloton-bike-plus', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1), 2495.00, 'USD', 'https://bestbuy.com/peloton-bike-plus', 'in_stock', now()),

-- Yeti Rambler prices
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1), 45.00, 'USD', 'https://amazon.com/yeti-rambler-30oz', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM retailers WHERE name = 'Target' LIMIT 1), 44.99, 'USD', 'https://target.com/yeti-rambler-30oz', 'in_stock', now()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM retailers WHERE name = 'Walmart' LIMIT 1), 42.97, 'USD', 'https://walmart.com/yeti-rambler-30oz', 'in_stock', now())

ON CONFLICT (product_id, retailer_id) DO UPDATE SET
  price = EXCLUDED.price,
  last_checked = EXCLUDED.last_checked;

-- Generate 30 days of price history for each product
DO $$
DECLARE
  product_record RECORD;
  price_record RECORD;
  day_offset INTEGER;
  base_price NUMERIC;
  daily_price NUMERIC;
  price_variation NUMERIC;
BEGIN
  -- Loop through each product
  FOR product_record IN SELECT id FROM products LOOP
    -- Loop through each price for this product
    FOR price_record IN SELECT retailer_id, price FROM prices WHERE product_id = product_record.id LOOP
      base_price := price_record.price;
      
      -- Generate 30 days of history (going backwards)
      FOR day_offset IN 1..30 LOOP
        -- Create realistic price variations (±5% with slight downward trend over time)
        price_variation := (random() - 0.5) * 0.1; -- ±5% variation
        daily_price := base_price * (1 + price_variation + (day_offset * 0.001)); -- Slight upward trend going back in time
        
        INSERT INTO price_history (product_id, retailer_id, price, currency, recorded_at)
        VALUES (
          product_record.id,
          price_record.retailer_id,
          ROUND(daily_price, 2),
          'USD',
          now() - (day_offset || ' days')::interval
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Update featured deals based on the new sample data
DO $$
DECLARE
  product_record RECORD;
  min_price NUMERIC;
  max_price NUMERIC;
  savings_amount NUMERIC;
  savings_percentage NUMERIC;
  deal_rank INTEGER := 1;
BEGIN
  -- Clear existing featured deals
  DELETE FROM featured_deals;
  
  -- Calculate deals for products with significant savings
  FOR product_record IN 
    SELECT 
      p.id,
      MIN(pr.price) as min_price,
      MAX(pr.price) as max_price
    FROM products p
    JOIN prices pr ON p.id = pr.product_id
    JOIN retailers r ON pr.retailer_id = r.id
    WHERE r.is_active = true AND pr.availability = 'in_stock'
    GROUP BY p.id
    HAVING MAX(pr.price) - MIN(pr.price) > 0
    ORDER BY ((MAX(pr.price) - MIN(pr.price)) / MAX(pr.price)) DESC
    LIMIT 10
  LOOP
    min_price := product_record.min_price;
    max_price := product_record.max_price;
    savings_amount := max_price - min_price;
    savings_percentage := (savings_amount / max_price) * 100;
    
    -- Only include deals with at least 5% savings
    IF savings_percentage >= 5 THEN
      INSERT INTO featured_deals (
        product_id,
        savings_amount,
        savings_percentage,
        lowest_price,
        highest_price,
        deal_rank,
        expires_at
      ) VALUES (
        product_record.id,
        savings_amount,
        savings_percentage,
        min_price,
        max_price,
        deal_rank,
        now() + interval '24 hours'
      );
      
      deal_rank := deal_rank + 1;
    END IF;
  END LOOP;
END $$;