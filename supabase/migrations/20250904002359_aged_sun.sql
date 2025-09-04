/*
  # Seed Initial Data

  1. Sample Data
    - Add sample categories (Electronics, Computers, Mobile Phones, etc.)
    - Add sample retailers (Amazon, Best Buy, Newegg, etc.)
    - Add sample products with pricing data

  2. Purpose
    - Provides initial data for testing and development
    - Demonstrates the database structure with realistic examples
*/

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Consumer electronics and gadgets'),
  ('Computers', 'computers', 'Desktop computers, laptops, and accessories'),
  ('Mobile Phones', 'mobile-phones', 'Smartphones and mobile devices'),
  ('Gaming', 'gaming', 'Gaming consoles, accessories, and games'),
  ('Audio', 'audio', 'Headphones, speakers, and audio equipment')
ON CONFLICT (name) DO NOTHING;

-- Insert sample retailers
INSERT INTO retailers (name, website_url, logo_url) VALUES
  ('Amazon', 'https://amazon.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Best Buy', 'https://bestbuy.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Newegg', 'https://newegg.com', 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('B&H Photo', 'https://bhphotovideo.com', 'https://images.pexels.com/photos/5632383/pexels-photo-5632383.jpeg?auto=compress&cs=tinysrgb&w=100')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
WITH category_ids AS (
  SELECT id as computers_id FROM categories WHERE slug = 'computers' LIMIT 1
), retailer_ids AS (
  SELECT 
    (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1) as amazon_id,
    (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1) as bestbuy_id,
    (SELECT id FROM retailers WHERE name = 'Newegg' LIMIT 1) as newegg_id
)
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications)
SELECT 
  'MacBook Pro 14-inch',
  'Apple MacBook Pro with M3 chip, 14-inch display',
  'Apple',
  'MacBook Pro 14"',
  c.computers_id,
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"processor": "Apple M3", "ram": "16GB", "storage": "512GB SSD", "display": "14-inch Liquid Retina XDR"}'::jsonb
FROM category_ids c;

-- Insert sample prices
WITH product_data AS (
  SELECT id as product_id FROM products WHERE name = 'MacBook Pro 14-inch' LIMIT 1
), retailer_data AS (
  SELECT 
    (SELECT id FROM retailers WHERE name = 'Amazon' LIMIT 1) as amazon_id,
    (SELECT id FROM retailers WHERE name = 'Best Buy' LIMIT 1) as bestbuy_id,
    (SELECT id FROM retailers WHERE name = 'Newegg' LIMIT 1) as newegg_id
)
INSERT INTO prices (product_id, retailer_id, price, product_url, availability)
SELECT 
  p.product_id,
  r.amazon_id,
  1999.00,
  'https://amazon.com/macbook-pro-14',
  'in_stock'
FROM product_data p, retailer_data r
UNION ALL
SELECT 
  p.product_id,
  r.bestbuy_id,
  2049.99,
  'https://bestbuy.com/macbook-pro-14',
  'in_stock'
FROM product_data p, retailer_data r
UNION ALL
SELECT 
  p.product_id,
  r.newegg_id,
  1979.99,
  'https://newegg.com/macbook-pro-14',
  'limited_stock'
FROM product_data p, retailer_data r;