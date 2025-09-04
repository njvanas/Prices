/*
  # Initial Schema for Price Comparison Site

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `retailers`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `website_url` (text)
      - `logo_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `brand` (text)
      - `model` (text)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `specifications` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `prices`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `retailer_id` (uuid, foreign key)
      - `price` (decimal)
      - `currency` (text, default 'USD')
      - `product_url` (text)
      - `availability` (text)
      - `last_checked` (timestamp)
      - `created_at` (timestamp)
    
    - `price_history`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `retailer_id` (uuid, foreign key)
      - `price` (decimal)
      - `currency` (text, default 'USD')
      - `recorded_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products, categories, retailers, and prices
    - Price history is read-only for public users

  3. Indexes
    - Add indexes for frequently queried columns to optimize performance
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  website_url text NOT NULL,
  logo_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  brand text DEFAULT '',
  model text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  product_url text NOT NULL,
  availability text DEFAULT 'in_stock',
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, retailer_id)
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are publicly readable"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Retailers are publicly readable"
  ON retailers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Prices are publicly readable"
  ON prices
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Price history is publicly readable"
  ON price_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_retailer_id ON prices(retailer_id);
CREATE INDEX IF NOT EXISTS idx_prices_last_checked ON prices(last_checked);
CREATE INDEX IF NOT EXISTS idx_price_history_product_retailer ON price_history(product_id, retailer_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();