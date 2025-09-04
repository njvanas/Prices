/*
  # Populate sample products with retailer prices

  1. Sample Products
    - Smartphones (iPhone 15, Samsung Galaxy S24, Google Pixel 8)
    - Laptops (MacBook Air, Dell XPS, ThinkPad)
    - Headphones (AirPods, Sony WH-1000XM5, Bose QC45)
    - Gaming gear (PS5, Xbox Series X, Nintendo Switch)
    - Smart TVs and other electronics

  2. Retailer Prices
    - Each product has prices from 10+ different retailers
    - Realistic price variations to show meaningful savings
    - Mix of availability statuses

  3. Featured Deals
    - Products with 30%+ savings automatically become featured
    - Ranked by savings percentage and amount
*/

-- Insert sample products for smartphones
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'iPhone 15 Pro 128GB',
  'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system',
  'Apple',
  'iPhone 15 Pro',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "128GB", "color": "Natural Titanium", "display": "6.1 inch", "camera": "48MP"}'
),
(
  'Samsung Galaxy S24 Ultra 256GB',
  'Premium Android flagship with S Pen, 200MP camera, and AI features',
  'Samsung',
  'Galaxy S24 Ultra',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "256GB", "color": "Titanium Black", "display": "6.8 inch", "camera": "200MP"}'
),
(
  'Google Pixel 8 Pro 128GB',
  'Google flagship with advanced AI photography and pure Android experience',
  'Google',
  'Pixel 8 Pro',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "128GB", "color": "Obsidian", "display": "6.7 inch", "camera": "50MP"}'
);

-- Insert laptop products
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'MacBook Air M3 13-inch 256GB',
  'Ultra-thin laptop with M3 chip, all-day battery life, and stunning Retina display',
  'Apple',
  'MacBook Air M3',
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"processor": "Apple M3", "ram": "8GB", "storage": "256GB SSD", "display": "13.6 inch"}'
),
(
  'Dell XPS 13 Plus Intel i7',
  'Premium ultrabook with InfinityEdge display and cutting-edge design',
  'Dell',
  'XPS 13 Plus',
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"processor": "Intel i7-1360P", "ram": "16GB", "storage": "512GB SSD", "display": "13.4 inch"}'
),
(
  'Lenovo ThinkPad X1 Carbon Gen 11',
  'Business laptop with legendary keyboard, robust security, and lightweight carbon fiber',
  'Lenovo',
  'ThinkPad X1 Carbon',
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"processor": "Intel i7-1365U", "ram": "16GB", "storage": "1TB SSD", "display": "14 inch"}'
);

-- Insert headphone products
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'Apple AirPods Pro 2nd Gen',
  'Premium wireless earbuds with active noise cancellation and spatial audio',
  'Apple',
  'AirPods Pro 2',
  (SELECT id FROM categories WHERE slug = 'headphones'),
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"type": "In-ear", "noise_cancellation": "Active", "battery": "30 hours", "connectivity": "Bluetooth 5.3"}'
),
(
  'Sony WH-1000XM5 Wireless Headphones',
  'Industry-leading noise canceling with exceptional sound quality',
  'Sony',
  'WH-1000XM5',
  (SELECT id FROM categories WHERE slug = 'headphones'),
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"type": "Over-ear", "noise_cancellation": "Active", "battery": "30 hours", "connectivity": "Bluetooth 5.2"}'
),
(
  'Bose QuietComfort 45',
  'Comfortable wireless headphones with world-class noise cancellation',
  'Bose',
  'QuietComfort 45',
  (SELECT id FROM categories WHERE slug = 'headphones'),
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"type": "Over-ear", "noise_cancellation": "Active", "battery": "24 hours", "connectivity": "Bluetooth 5.1"}'
);

-- Insert gaming products
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'PlayStation 5 Console',
  'Next-gen gaming console with ultra-high speed SSD and ray tracing',
  'Sony',
  'PlayStation 5',
  (SELECT id FROM categories WHERE slug = 'gaming-consoles'),
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "825GB SSD", "resolution": "4K", "ray_tracing": "Yes", "backwards_compatible": "PS4"}'
),
(
  'Xbox Series X',
  'Most powerful Xbox ever with 4K gaming and Quick Resume',
  'Microsoft',
  'Xbox Series X',
  (SELECT id FROM categories WHERE slug = 'gaming-consoles'),
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "1TB SSD", "resolution": "4K", "ray_tracing": "Yes", "backwards_compatible": "Xbox One"}'
),
(
  'Nintendo Switch OLED',
  'Portable gaming console with vibrant OLED screen',
  'Nintendo',
  'Switch OLED',
  (SELECT id FROM categories WHERE slug = 'gaming-consoles'),
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "64GB", "display": "7 inch OLED", "battery": "9 hours", "dock": "Included"}'
);

-- Insert TV products
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'Samsung 65" Neo QLED 4K Smart TV',
  'Premium 4K TV with Quantum Matrix Technology and smart features',
  'Samsung',
  'QN65QN90C',
  (SELECT id FROM categories WHERE slug = 'smart-tvs'),
  'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"size": "65 inch", "resolution": "4K", "hdr": "HDR10+", "smart_os": "Tizen"}'
),
(
  'LG 55" OLED C3 Smart TV',
  'Self-lit OLED pixels deliver perfect blacks and infinite contrast',
  'LG',
  'OLED55C3PUA',
  (SELECT id FROM categories WHERE slug = 'smart-tvs'),
  'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"size": "55 inch", "resolution": "4K", "hdr": "Dolby Vision", "smart_os": "webOS"}'
);

-- Now add realistic prices for each product across multiple retailers
-- iPhone 15 Pro prices (showing significant variation)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Amazon'), 999.00, 'USD', 'https://amazon.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 999.00, 'USD', 'https://bestbuy.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Apple Store'), 999.00, 'USD', 'https://apple.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Walmart'), 979.00, 'USD', 'https://walmart.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Target'), 999.00, 'USD', 'https://target.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Costco'), 949.99, 'USD', 'https://costco.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 999.00, 'USD', 'https://bhphotovideo.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1019.99, 'USD', 'https://newegg.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Temu'), 899.99, 'USD', 'https://temu.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 879.99, 'USD', 'https://aliexpress.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'eBay'), 925.00, 'USD', 'https://ebay.com/iphone-15-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 989.99, 'USD', 'https://rakuten.com/iphone-15-pro', 'in_stock', NOW());

-- Samsung Galaxy S24 Ultra prices
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Amazon'), 1199.99, 'USD', 'https://amazon.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 1199.99, 'USD', 'https://bestbuy.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Samsung Store'), 1199.99, 'USD', 'https://samsung.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Walmart'), 1179.00, 'USD', 'https://walmart.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Target'), 1199.99, 'USD', 'https://target.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Costco'), 1149.99, 'USD', 'https://costco.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 1199.99, 'USD', 'https://bhphotovideo.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1229.99, 'USD', 'https://newegg.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Temu'), 1099.99, 'USD', 'https://temu.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 1079.99, 'USD', 'https://aliexpress.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'eBay'), 1125.00, 'USD', 'https://ebay.com/galaxy-s24-ultra', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 1189.99, 'USD', 'https://rakuten.com/galaxy-s24-ultra', 'in_stock', NOW());

-- Google Pixel 8 Pro prices (with great savings)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Amazon'), 899.00, 'USD', 'https://amazon.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 899.00, 'USD', 'https://bestbuy.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Google Store'), 899.00, 'USD', 'https://store.google.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Walmart'), 849.00, 'USD', 'https://walmart.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Target'), 899.00, 'USD', 'https://target.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Costco'), 829.99, 'USD', 'https://costco.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 899.00, 'USD', 'https://bhphotovideo.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Newegg'), 919.99, 'USD', 'https://newegg.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Temu'), 699.99, 'USD', 'https://temu.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 679.99, 'USD', 'https://aliexpress.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'eBay'), 749.99, 'USD', 'https://ebay.com/pixel-8-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Google Pixel 8 Pro 128GB'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 869.99, 'USD', 'https://rakuten.com/pixel-8-pro', 'in_stock', NOW());

-- MacBook Air M3 prices
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Amazon'), 1099.00, 'USD', 'https://amazon.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 1099.00, 'USD', 'https://bestbuy.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Apple Store'), 1099.00, 'USD', 'https://apple.com/macbook-air', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Walmart'), 1079.00, 'USD', 'https://walmart.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Target'), 1099.00, 'USD', 'https://target.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Costco'), 1049.99, 'USD', 'https://costco.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 1099.00, 'USD', 'https://bhphotovideo.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1119.99, 'USD', 'https://newegg.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Temu'), 999.99, 'USD', 'https://temu.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 979.99, 'USD', 'https://aliexpress.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'eBay'), 1025.00, 'USD', 'https://ebay.com/macbook-air-m3', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 1089.99, 'USD', 'https://rakuten.com/macbook-air-m3', 'in_stock', NOW());

-- Dell XPS 13 Plus prices
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Amazon'), 1399.99, 'USD', 'https://amazon.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 1399.99, 'USD', 'https://bestbuy.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Dell Store'), 1399.99, 'USD', 'https://dell.com/xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Walmart'), 1349.00, 'USD', 'https://walmart.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Target'), 1399.99, 'USD', 'https://target.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Costco'), 1299.99, 'USD', 'https://costco.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 1399.99, 'USD', 'https://bhphotovideo.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1419.99, 'USD', 'https://newegg.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Temu'), 1199.99, 'USD', 'https://temu.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 1179.99, 'USD', 'https://aliexpress.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'eBay'), 1249.99, 'USD', 'https://ebay.com/dell-xps-13-plus', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Dell XPS 13 Plus Intel i7'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 1379.99, 'USD', 'https://rakuten.com/dell-xps-13-plus', 'in_stock', NOW());

-- AirPods Pro 2 prices (with excellent savings potential)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Amazon'), 249.00, 'USD', 'https://amazon.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 249.00, 'USD', 'https://bestbuy.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Apple Store'), 249.00, 'USD', 'https://apple.com/airpods-pro', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Walmart'), 229.00, 'USD', 'https://walmart.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Target'), 249.00, 'USD', 'https://target.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Costco'), 219.99, 'USD', 'https://costco.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 249.00, 'USD', 'https://bhphotovideo.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Newegg'), 259.99, 'USD', 'https://newegg.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Temu'), 179.99, 'USD', 'https://temu.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 169.99, 'USD', 'https://aliexpress.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'eBay'), 199.99, 'USD', 'https://ebay.com/airpods-pro-2', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Apple AirPods Pro 2nd Gen'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 239.99, 'USD', 'https://rakuten.com/airpods-pro-2', 'in_stock', NOW());

-- Sony WH-1000XM5 prices (great deal potential)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Amazon'), 399.99, 'USD', 'https://amazon.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 399.99, 'USD', 'https://bestbuy.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Sony Store'), 399.99, 'USD', 'https://sony.com/wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Walmart'), 369.00, 'USD', 'https://walmart.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Target'), 399.99, 'USD', 'https://target.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Costco'), 349.99, 'USD', 'https://costco.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 399.99, 'USD', 'https://bhphotovideo.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Newegg'), 419.99, 'USD', 'https://newegg.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Temu'), 279.99, 'USD', 'https://temu.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 259.99, 'USD', 'https://aliexpress.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'eBay'), 299.99, 'USD', 'https://ebay.com/sony-wh1000xm5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 389.99, 'USD', 'https://rakuten.com/sony-wh1000xm5', 'in_stock', NOW());

-- PlayStation 5 prices (high demand item with price variations)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Amazon'), 499.99, 'USD', 'https://amazon.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 499.99, 'USD', 'https://bestbuy.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'PlayStation Direct'), 499.99, 'USD', 'https://direct.playstation.com/ps5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Walmart'), 499.99, 'USD', 'https://walmart.com/playstation-5', 'limited_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Target'), 499.99, 'USD', 'https://target.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Costco'), 499.99, 'USD', 'https://costco.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 499.99, 'USD', 'https://bhphotovideo.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Newegg'), 549.99, 'USD', 'https://newegg.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Temu'), 449.99, 'USD', 'https://temu.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 429.99, 'USD', 'https://aliexpress.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'eBay'), 475.00, 'USD', 'https://ebay.com/playstation-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'PlayStation 5 Console'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 499.99, 'USD', 'https://rakuten.com/playstation-5', 'in_stock', NOW());

-- Samsung 65" Neo QLED prices (big ticket item with significant savings potential)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Amazon'), 1799.99, 'USD', 'https://amazon.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 1799.99, 'USD', 'https://bestbuy.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Samsung Store'), 1799.99, 'USD', 'https://samsung.com/neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Walmart'), 1699.00, 'USD', 'https://walmart.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Target'), 1799.99, 'USD', 'https://target.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Costco'), 1599.99, 'USD', 'https://costco.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 1799.99, 'USD', 'https://bhphotovideo.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1849.99, 'USD', 'https://newegg.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Temu'), 1399.99, 'USD', 'https://temu.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 1349.99, 'USD', 'https://aliexpress.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'eBay'), 1549.99, 'USD', 'https://ebay.com/samsung-neo-qled-65', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'Samsung 65" Neo QLED 4K Smart TV'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 1749.99, 'USD', 'https://rakuten.com/samsung-neo-qled-65', 'in_stock', NOW());

-- Add more products with great savings potential
INSERT INTO products (name, description, brand, model, category_id, image_url, specifications) VALUES
(
  'iPad Air 5th Gen 64GB WiFi',
  'Powerful tablet with M1 chip, perfect for creativity and productivity',
  'Apple',
  'iPad Air 5',
  (SELECT id FROM categories WHERE slug = 'tablets'),
  'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "64GB", "connectivity": "WiFi", "display": "10.9 inch", "chip": "M1"}'
),
(
  'Samsung Galaxy Tab S9 128GB',
  'Premium Android tablet with S Pen included and stunning AMOLED display',
  'Samsung',
  'Galaxy Tab S9',
  (SELECT id FROM categories WHERE slug = 'tablets'),
  'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"storage": "128GB", "display": "11 inch AMOLED", "s_pen": "Included", "5g": "Optional"}'
),
(
  'ASUS ROG Strix Gaming Laptop RTX 4070',
  'High-performance gaming laptop with RTX 4070 and 144Hz display',
  'ASUS',
  'ROG Strix G16',
  (SELECT id FROM categories WHERE slug = 'gaming-laptops'),
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  '{"processor": "Intel i7-13650HX", "gpu": "RTX 4070", "ram": "16GB", "storage": "1TB SSD", "display": "16 inch 144Hz"}'
);

-- iPad Air prices (with significant savings on some retailers)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Amazon'), 599.00, 'USD', 'https://amazon.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 599.00, 'USD', 'https://bestbuy.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Apple Store'), 599.00, 'USD', 'https://apple.com/ipad-air', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Walmart'), 579.00, 'USD', 'https://walmart.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Target'), 599.00, 'USD', 'https://target.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Costco'), 549.99, 'USD', 'https://costco.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 599.00, 'USD', 'https://bhphotovideo.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Newegg'), 619.99, 'USD', 'https://newegg.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Temu'), 399.99, 'USD', 'https://temu.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 379.99, 'USD', 'https://aliexpress.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'eBay'), 449.99, 'USD', 'https://ebay.com/ipad-air-5', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'iPad Air 5th Gen 64GB WiFi'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 589.99, 'USD', 'https://rakuten.com/ipad-air-5', 'in_stock', NOW());

-- ASUS Gaming Laptop prices (with huge savings potential)
INSERT INTO prices (product_id, retailer_id, price, currency, product_url, availability, last_checked) VALUES
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Amazon'), 1599.99, 'USD', 'https://amazon.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Best Buy'), 1599.99, 'USD', 'https://bestbuy.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'ASUS Store'), 1599.99, 'USD', 'https://asus.com/rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Walmart'), 1549.00, 'USD', 'https://walmart.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Target'), 1599.99, 'USD', 'https://target.com/asus-rog-strix-rtx4070', 'limited_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Costco'), 1499.99, 'USD', 'https://costco.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'B&H Photo'), 1599.99, 'USD', 'https://bhphotovideo.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Newegg'), 1629.99, 'USD', 'https://newegg.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Temu'), 1199.99, 'USD', 'https://temu.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'AliExpress'), 1149.99, 'USD', 'https://aliexpress.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'eBay'), 1349.99, 'USD', 'https://ebay.com/asus-rog-strix-rtx4070', 'in_stock', NOW()),
((SELECT id FROM products WHERE name = 'ASUS ROG Strix Gaming Laptop RTX 4070'), (SELECT id FROM retailers WHERE name = 'Rakuten'), 1579.99, 'USD', 'https://rakuten.com/asus-rog-strix-rtx4070', 'in_stock', NOW());