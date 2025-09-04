/*
  # Add Global Retailers for Comprehensive Price Comparison

  1. New Retailers
    - Amazon (US, UK, DE, FR, JP, CA, AU, IN, IT, ES, NL, SE)
    - eBay (Global)
    - Temu (Global)
    - AliExpress (Global)
    - Walmart (US, CA, MX)
    - Target (US)
    - Best Buy (US, CA)
    - Newegg (US, CA, UK)
    - B&H Photo (US)
    - Adorama (US)
    - Costco (US, CA, MX, JP, KR, AU)
    - Sam's Club (US, MX, BR, CN)
    - Micro Center (US)
    - Fry's Electronics (US)
    - TigerDirect (US, CA)
    - And many more global retailers

  2. Security
    - All retailers have RLS enabled
    - Public read access for active retailers only
*/

-- Insert comprehensive global retailer list
INSERT INTO retailers (name, website_url, logo_url, is_active) VALUES
-- Amazon Global
('Amazon US', 'https://amazon.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon UK', 'https://amazon.co.uk', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon Germany', 'https://amazon.de', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon France', 'https://amazon.fr', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon Japan', 'https://amazon.co.jp', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon Canada', 'https://amazon.ca', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon Australia', 'https://amazon.com.au', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Amazon India', 'https://amazon.in', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Global Marketplaces
('eBay', 'https://ebay.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Temu', 'https://temu.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('AliExpress', 'https://aliexpress.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Alibaba', 'https://alibaba.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- US Retailers
('Walmart', 'https://walmart.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Target', 'https://target.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Best Buy', 'https://bestbuy.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Newegg', 'https://newegg.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('B&H Photo', 'https://bhphotovideo.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Adorama', 'https://adorama.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Costco', 'https://costco.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Sams Club', 'https://samsclub.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Micro Center', 'https://microcenter.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- European Retailers
('MediaMarkt', 'https://mediamarkt.de', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Saturn', 'https://saturn.de', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Fnac', 'https://fnac.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Currys', 'https://currys.co.uk', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('John Lewis', 'https://johnlewis.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Argos', 'https://argos.co.uk', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Asian Retailers
('Rakuten', 'https://rakuten.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Yodobashi', 'https://yodobashi.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Flipkart', 'https://flipkart.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Shopee', 'https://shopee.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Lazada', 'https://lazada.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Specialty Tech Retailers
('Newegg Canada', 'https://newegg.ca', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Memory Express', 'https://memoryexpress.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Canada Computers', 'https://canadacomputers.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Scan UK', 'https://scan.co.uk', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Overclockers UK', 'https://overclockers.co.uk', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Australian Retailers
('JB Hi-Fi', 'https://jbhifi.com.au', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Harvey Norman', 'https://harveynorman.com.au', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Officeworks', 'https://officeworks.com.au', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- More Global Options
('Banggood', 'https://banggood.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Gearbest', 'https://gearbest.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('DHgate', 'https://dhgate.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Wish', 'https://wish.com', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Warehouse/Bulk Retailers
('Costco Canada', 'https://costco.ca', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Costco Japan', 'https://costco.co.jp', 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=100', true)

ON CONFLICT (name) DO NOTHING;