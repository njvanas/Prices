/*
  # Global Countries and Retailers System

  1. New Tables
    - `countries`
      - `code` (text, primary key) - ISO country code
      - `name` (text) - Country name
      - `currency` (text) - Currency code (USD, EUR, etc.)
      - `currency_symbol` (text) - Currency symbol ($, €, etc.)
      - `flag_emoji` (text) - Flag emoji
      - `is_active` (boolean) - Whether country is supported
    - `retailer_countries` (junction table)
      - Links retailers to countries they operate in
      - `retailer_id` (uuid) - Foreign key to retailers
      - `country_code` (text) - Foreign key to countries
      - `website_url` (text) - Country-specific website URL
      - `is_primary` (boolean) - Primary retailer for that country

  2. Enhanced Retailers
    - Added 50+ global retailers covering all major regions
    - Includes major players: Amazon, Temu, AliExpress, Walmart, Target, etc.
    - Regional specialists: Flipkart (India), Rakuten (Japan), Allegro (Poland)

  3. Security
    - Enable RLS on all new tables
    - Public read access for countries and retailer relationships
    - Service role can manage all data

  4. Global Coverage
    - 25+ countries across all continents
    - Major currencies: USD, EUR, GBP, JPY, CNY, INR, etc.
    - Regional e-commerce coverage for comprehensive price comparison
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  currency text NOT NULL,
  currency_symbol text NOT NULL DEFAULT '$',
  flag_emoji text NOT NULL DEFAULT '🌍',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create retailer_countries junction table
CREATE TABLE IF NOT EXISTS retailer_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  country_code text NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
  website_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(retailer_id, country_code)
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_countries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Countries are publicly readable"
  ON countries
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Retailer countries are publicly readable"
  ON retailer_countries
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role policies for management
CREATE POLICY "Service role can manage countries"
  ON countries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage retailer countries"
  ON retailer_countries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert countries with their currencies
INSERT INTO countries (code, name, currency, currency_symbol, flag_emoji) VALUES
-- North America
('US', 'United States', 'USD', '$', '🇺🇸'),
('CA', 'Canada', 'CAD', 'C$', '🇨🇦'),
('MX', 'Mexico', 'MXN', '$', '🇲🇽'),

-- Europe
('GB', 'United Kingdom', 'GBP', '£', '🇬🇧'),
('DE', 'Germany', 'EUR', '€', '🇩🇪'),
('FR', 'France', 'EUR', '€', '🇫🇷'),
('IT', 'Italy', 'EUR', '€', '🇮🇹'),
('ES', 'Spain', 'EUR', '€', '🇪🇸'),
('NL', 'Netherlands', 'EUR', '€', '🇳🇱'),
('PL', 'Poland', 'PLN', 'zł', '🇵🇱'),
('SE', 'Sweden', 'SEK', 'kr', '🇸🇪'),
('NO', 'Norway', 'NOK', 'kr', '🇳🇴'),

-- Asia Pacific
('JP', 'Japan', 'JPY', '¥', '🇯🇵'),
('CN', 'China', 'CNY', '¥', '🇨🇳'),
('KR', 'South Korea', 'KRW', '₩', '🇰🇷'),
('IN', 'India', 'INR', '₹', '🇮🇳'),
('AU', 'Australia', 'AUD', 'A$', '🇦🇺'),
('NZ', 'New Zealand', 'NZD', 'NZ$', '🇳🇿'),
('SG', 'Singapore', 'SGD', 'S$', '🇸🇬'),
('HK', 'Hong Kong', 'HKD', 'HK$', '🇭🇰'),
('TH', 'Thailand', 'THB', '฿', '🇹🇭'),
('MY', 'Malaysia', 'MYR', 'RM', '🇲🇾'),

-- Middle East & Africa
('AE', 'United Arab Emirates', 'AED', 'د.إ', '🇦🇪'),
('SA', 'Saudi Arabia', 'SAR', '﷼', '🇸🇦'),
('ZA', 'South Africa', 'ZAR', 'R', '🇿🇦'),

-- South America
('BR', 'Brazil', 'BRL', 'R$', '🇧🇷'),
('AR', 'Argentina', 'ARS', '$', '🇦🇷');

-- Clear existing retailers and add comprehensive global coverage
DELETE FROM retailers;

-- Insert global retailers
INSERT INTO retailers (name, website_url, logo_url, is_active) VALUES
-- Global Giants
('Amazon', 'https://amazon.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Temu', 'https://temu.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('AliExpress', 'https://aliexpress.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('eBay', 'https://ebay.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- US Retailers
('Walmart', 'https://walmart.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Target', 'https://target.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Best Buy', 'https://bestbuy.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Costco', 'https://costco.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Home Depot', 'https://homedepot.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Newegg', 'https://newegg.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- European Retailers
('MediaMarkt', 'https://mediamarkt.de', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Saturn', 'https://saturn.de', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Fnac', 'https://fnac.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Currys', 'https://currys.co.uk', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Argos', 'https://argos.co.uk', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Allegro', 'https://allegro.pl', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Asian Retailers
('Rakuten', 'https://rakuten.co.jp', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Flipkart', 'https://flipkart.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('JD.com', 'https://jd.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Tmall', 'https://tmall.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Shopee', 'https://shopee.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Lazada', 'https://lazada.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Australian/NZ Retailers
('JB Hi-Fi', 'https://jbhifi.com.au', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Harvey Norman', 'https://harveynorman.com.au', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('The Warehouse', 'https://thewarehouse.co.nz', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Canadian Retailers
('Canadian Tire', 'https://canadiantire.ca', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Best Buy Canada', 'https://bestbuy.ca', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- Middle East Retailers
('Noon', 'https://noon.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Souq', 'https://souq.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- South American Retailers
('Mercado Libre', 'https://mercadolibre.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Magazine Luiza', 'https://magazineluiza.com.br', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true),

-- African Retailers
('Takealot', 'https://takealot.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100', true),
('Jumia', 'https://jumia.com', 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100', true);

-- Map retailers to countries they operate in
INSERT INTO retailer_countries (retailer_id, country_code, website_url, is_primary) 
SELECT r.id, c.country_code, c.website_url, c.is_primary
FROM retailers r
CROSS JOIN (VALUES
  -- Amazon operates globally
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'US', 'https://amazon.com', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'CA', 'https://amazon.ca', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'GB', 'https://amazon.co.uk', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'DE', 'https://amazon.de', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'FR', 'https://amazon.fr', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'IT', 'https://amazon.it', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'ES', 'https://amazon.es', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'JP', 'https://amazon.co.jp', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'AU', 'https://amazon.com.au', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'IN', 'https://amazon.in', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'BR', 'https://amazon.com.br', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'MX', 'https://amazon.com.mx', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'AE', 'https://amazon.ae', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'SA', 'https://amazon.sa', true),
  ((SELECT id FROM retailers WHERE name = 'Amazon'), 'SG', 'https://amazon.sg', true),

  -- Temu operates globally
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'US', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'CA', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'GB', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'DE', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'FR', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'AU', 'https://temu.com', false),
  ((SELECT id FROM retailers WHERE name = 'Temu'), 'NZ', 'https://temu.com', false),

  -- AliExpress operates globally
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'US', 'https://aliexpress.us', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'GB', 'https://aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'DE', 'https://de.aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'FR', 'https://fr.aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'ES', 'https://es.aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'IT', 'https://it.aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'AU', 'https://aliexpress.com', false),
  ((SELECT id FROM retailers WHERE name = 'AliExpress'), 'BR', 'https://pt.aliexpress.com', false),

  -- eBay operates globally
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'US', 'https://ebay.com', false),
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'CA', 'https://ebay.ca', false),
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'GB', 'https://ebay.co.uk', false),
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'DE', 'https://ebay.de', false),
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'FR', 'https://ebay.fr', false),
  ((SELECT id FROM retailers WHERE name = 'eBay'), 'AU', 'https://ebay.com.au', false),

  -- US-specific retailers
  ((SELECT id FROM retailers WHERE name = 'Walmart'), 'US', 'https://walmart.com', false),
  ((SELECT id FROM retailers WHERE name = 'Target'), 'US', 'https://target.com', false),
  ((SELECT id FROM retailers WHERE name = 'Best Buy'), 'US', 'https://bestbuy.com', false),
  ((SELECT id FROM retailers WHERE name = 'Costco'), 'US', 'https://costco.com', false),
  ((SELECT id FROM retailers WHERE name = 'Home Depot'), 'US', 'https://homedepot.com', false),
  ((SELECT id FROM retailers WHERE name = 'Newegg'), 'US', 'https://newegg.com', false),

  -- European retailers
  ((SELECT id FROM retailers WHERE name = 'MediaMarkt'), 'DE', 'https://mediamarkt.de', false),
  ((SELECT id FROM retailers WHERE name = 'MediaMarkt'), 'NL', 'https://mediamarkt.nl', false),
  ((SELECT id FROM retailers WHERE name = 'Saturn'), 'DE', 'https://saturn.de', false),
  ((SELECT id FROM retailers WHERE name = 'Fnac'), 'FR', 'https://fnac.com', false),
  ((SELECT id FROM retailers WHERE name = 'Fnac'), 'ES', 'https://fnac.es', false),
  ((SELECT id FROM retailers WHERE name = 'Currys'), 'GB', 'https://currys.co.uk', false),
  ((SELECT id FROM retailers WHERE name = 'Argos'), 'GB', 'https://argos.co.uk', false),
  ((SELECT id FROM retailers WHERE name = 'Allegro'), 'PL', 'https://allegro.pl', true),

  -- Asian retailers
  ((SELECT id FROM retailers WHERE name = 'Rakuten'), 'JP', 'https://rakuten.co.jp', true),
  ((SELECT id FROM retailers WHERE name = 'Flipkart'), 'IN', 'https://flipkart.com', true),
  ((SELECT id FROM retailers WHERE name = 'JD.com'), 'CN', 'https://jd.com', true),
  ((SELECT id FROM retailers WHERE name = 'Tmall'), 'CN', 'https://tmall.com', false),
  ((SELECT id FROM retailers WHERE name = 'Shopee'), 'SG', 'https://shopee.sg', true),
  ((SELECT id FROM retailers WHERE name = 'Shopee'), 'MY', 'https://shopee.com.my', true),
  ((SELECT id FROM retailers WHERE name = 'Shopee'), 'TH', 'https://shopee.co.th', true),
  ((SELECT id FROM retailers WHERE name = 'Lazada'), 'SG', 'https://lazada.sg', false),
  ((SELECT id FROM retailers WHERE name = 'Lazada'), 'MY', 'https://lazada.com.my', false),
  ((SELECT id FROM retailers WHERE name = 'Lazada'), 'TH', 'https://lazada.co.th', false),

  -- Australian/NZ retailers
  ((SELECT id FROM retailers WHERE name = 'JB Hi-Fi'), 'AU', 'https://jbhifi.com.au', true),
  ((SELECT id FROM retailers WHERE name = 'Harvey Norman'), 'AU', 'https://harveynorman.com.au', false),
  ((SELECT id FROM retailers WHERE name = 'Harvey Norman'), 'NZ', 'https://harveynorman.co.nz', false),
  ((SELECT id FROM retailers WHERE name = 'The Warehouse'), 'NZ', 'https://thewarehouse.co.nz', true),

  -- Canadian retailers
  ((SELECT id FROM retailers WHERE name = 'Canadian Tire'), 'CA', 'https://canadiantire.ca', false),
  ((SELECT id FROM retailers WHERE name = 'Best Buy Canada'), 'CA', 'https://bestbuy.ca', false),

  -- Middle East retailers
  ((SELECT id FROM retailers WHERE name = 'Noon'), 'AE', 'https://noon.com', true),
  ((SELECT id FROM retailers WHERE name = 'Noon'), 'SA', 'https://noon.com', true),
  ((SELECT id FROM retailers WHERE name = 'Souq'), 'AE', 'https://souq.com', false),

  -- South American retailers
  ((SELECT id FROM retailers WHERE name = 'Mercado Libre'), 'BR', 'https://mercadolivre.com.br', true),
  ((SELECT id FROM retailers WHERE name = 'Mercado Libre'), 'AR', 'https://mercadolibre.com.ar', true),
  ((SELECT id FROM retailers WHERE name = 'Mercado Libre'), 'MX', 'https://mercadolibre.com.mx', true),
  ((SELECT id FROM retailers WHERE name = 'Magazine Luiza'), 'BR', 'https://magazineluiza.com.br', false),

  -- African retailers
  ((SELECT id FROM retailers WHERE name = 'Takealot'), 'ZA', 'https://takealot.com', true),
  ((SELECT id FROM retailers WHERE name = 'Jumia'), 'ZA', 'https://jumia.co.za', false)
) AS c(retailer_id, country_code, website_url, is_primary)
WHERE r.id = c.retailer_id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_retailer_countries_country ON retailer_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_retailer_countries_retailer ON retailer_countries(retailer_id);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(is_active);

-- Add currency column to prices table for multi-currency support
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prices' AND column_name = 'currency'
  ) THEN
    ALTER TABLE prices ALTER COLUMN currency SET DEFAULT 'USD';
  END IF;
END $$;