/*
  # Add country support for price comparison

  1. New Tables
    - `countries` - Store supported countries with currency info
    - `retailer_countries` - Many-to-many relationship for retailer availability by country

  2. Modified Tables
    - `prices` - Add country_code to link prices to specific countries
    - `price_history` - Add country_code for historical tracking

  3. Security
    - Enable RLS on new tables
    - Add policies for public read access
    - Update existing policies to consider country context

  4. Sample Data
    - Add major countries (US, UK, CA, AU, ZA, etc.)
    - Update sample retailers with country availability
    - Add country-specific pricing examples
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL, -- ISO 3166-1 alpha-2 code (US, UK, CA, etc.)
  name text NOT NULL,
  currency_code text NOT NULL DEFAULT 'USD', -- ISO 4217 currency code
  currency_symbol text NOT NULL DEFAULT '$',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create retailer_countries junction table
CREATE TABLE IF NOT EXISTS retailer_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  country_code text NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
  website_url text NOT NULL, -- Country-specific website URL
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(retailer_id, country_code)
);

-- Add country_code to prices table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prices' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE prices ADD COLUMN country_code text NOT NULL DEFAULT 'US';
    ALTER TABLE prices ADD CONSTRAINT prices_country_code_fkey 
      FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE;
  END IF;
END $$;

-- Add country_code to price_history table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_history' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE price_history ADD COLUMN country_code text NOT NULL DEFAULT 'US';
    ALTER TABLE price_history ADD CONSTRAINT price_history_country_code_fkey 
      FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE;
  END IF;
END $$;

-- Update unique constraint on prices to include country
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'prices_product_id_retailer_id_key'
  ) THEN
    ALTER TABLE prices DROP CONSTRAINT prices_product_id_retailer_id_key;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'prices_product_retailer_country_key'
  ) THEN
    ALTER TABLE prices ADD CONSTRAINT prices_product_retailer_country_key 
      UNIQUE (product_id, retailer_id, country_code);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prices_country_code ON prices(country_code);
CREATE INDEX IF NOT EXISTS idx_price_history_country_code ON price_history(country_code);
CREATE INDEX IF NOT EXISTS idx_retailer_countries_country_code ON retailer_countries(country_code);

-- Enable RLS on new tables
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
  USING (is_active = true);

-- Insert supported countries
INSERT INTO countries (code, name, currency_code, currency_symbol) VALUES
  ('US', 'United States', 'USD', '$'),
  ('UK', 'United Kingdom', 'GBP', '£'),
  ('CA', 'Canada', 'CAD', 'C$'),
  ('AU', 'Australia', 'AUD', 'A$'),
  ('ZA', 'South Africa', 'ZAR', 'R'),
  ('DE', 'Germany', 'EUR', '€'),
  ('FR', 'France', 'EUR', '€'),
  ('NL', 'Netherlands', 'EUR', '€'),
  ('JP', 'Japan', 'JPY', '¥'),
  ('IN', 'India', 'INR', '₹')
ON CONFLICT (code) DO NOTHING;

-- Update retailer countries (assuming existing retailers support multiple countries)
INSERT INTO retailer_countries (retailer_id, country_code, website_url)
SELECT 
  r.id,
  'US',
  r.website_url
FROM retailers r
WHERE NOT EXISTS (
  SELECT 1 FROM retailer_countries rc 
  WHERE rc.retailer_id = r.id AND rc.country_code = 'US'
);

-- Add some country-specific retailer examples
DO $$
DECLARE
  amazon_id uuid;
  bestbuy_id uuid;
  newegg_id uuid;
BEGIN
  -- Get existing retailer IDs
  SELECT id INTO amazon_id FROM retailers WHERE name = 'Amazon' LIMIT 1;
  SELECT id INTO bestbuy_id FROM retailers WHERE name = 'Best Buy' LIMIT 1;
  SELECT id INTO newegg_id FROM retailers WHERE name = 'Newegg' LIMIT 1;

  -- Add country-specific URLs for existing retailers
  IF amazon_id IS NOT NULL THEN
    INSERT INTO retailer_countries (retailer_id, country_code, website_url) VALUES
      (amazon_id, 'UK', 'https://amazon.co.uk'),
      (amazon_id, 'CA', 'https://amazon.ca'),
      (amazon_id, 'AU', 'https://amazon.com.au'),
      (amazon_id, 'DE', 'https://amazon.de'),
      (amazon_id, 'FR', 'https://amazon.fr'),
      (amazon_id, 'JP', 'https://amazon.co.jp'),
      (amazon_id, 'IN', 'https://amazon.in')
    ON CONFLICT (retailer_id, country_code) DO NOTHING;
  END IF;
END $$;

-- Insert South African specific retailers
INSERT INTO retailers (name, website_url, logo_url) VALUES
  ('Takealot', 'https://takealot.com', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Incredible Connection', 'https://incredibleconnection.co.za', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Makro', 'https://makro.co.za', 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=100')
ON CONFLICT (name) DO NOTHING;

-- Add South African retailer countries
DO $$
DECLARE
  takealot_id uuid;
  ic_id uuid;
  makro_id uuid;
BEGIN
  SELECT id INTO takealot_id FROM retailers WHERE name = 'Takealot' LIMIT 1;
  SELECT id INTO ic_id FROM retailers WHERE name = 'Incredible Connection' LIMIT 1;
  SELECT id INTO makro_id FROM retailers WHERE name = 'Makro' LIMIT 1;

  IF takealot_id IS NOT NULL THEN
    INSERT INTO retailer_countries (retailer_id, country_code, website_url) VALUES
      (takealot_id, 'ZA', 'https://takealot.com')
    ON CONFLICT (retailer_id, country_code) DO NOTHING;
  END IF;

  IF ic_id IS NOT NULL THEN
    INSERT INTO retailer_countries (retailer_id, country_code, website_url) VALUES
      (ic_id, 'ZA', 'https://incredibleconnection.co.za')
    ON CONFLICT (retailer_id, country_code) DO NOTHING;
  END IF;

  IF makro_id IS NOT NULL THEN
    INSERT INTO retailer_countries (retailer_id, country_code, website_url) VALUES
      (makro_id, 'ZA', 'https://makro.co.za')
    ON CONFLICT (retailer_id, country_code) DO NOTHING;
  END IF;
END $$;

-- Add country-specific pricing examples
DO $$
DECLARE
  macbook_id uuid;
  amazon_id uuid;
  takealot_id uuid;
BEGIN
  SELECT id INTO macbook_id FROM products WHERE name LIKE '%MacBook Pro%' LIMIT 1;
  SELECT id INTO amazon_id FROM retailers WHERE name = 'Amazon' LIMIT 1;
  SELECT id INTO takealot_id FROM retailers WHERE name = 'Takealot' LIMIT 1;

  IF macbook_id IS NOT NULL AND amazon_id IS NOT NULL THEN
    -- US pricing
    INSERT INTO prices (product_id, retailer_id, price, currency, product_url, country_code) VALUES
      (macbook_id, amazon_id, 1999.00, 'USD', 'https://amazon.com/macbook-pro', 'US')
    ON CONFLICT (product_id, retailer_id, country_code) DO NOTHING;

    -- UK pricing (higher due to VAT)
    INSERT INTO prices (product_id, retailer_id, price, currency, product_url, country_code) VALUES
      (macbook_id, amazon_id, 2099.00, 'GBP', 'https://amazon.co.uk/macbook-pro', 'UK')
    ON CONFLICT (product_id, retailer_id, country_code) DO NOTHING;
  END IF;

  IF macbook_id IS NOT NULL AND takealot_id IS NOT NULL THEN
    -- South African pricing
    INSERT INTO prices (product_id, retailer_id, price, currency, product_url, country_code) VALUES
      (macbook_id, takealot_id, 45999.00, 'ZAR', 'https://takealot.com/macbook-pro', 'ZA')
    ON CONFLICT (product_id, retailer_id, country_code) DO NOTHING;
  END IF;
END $$;