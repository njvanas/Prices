/*
  # Add specific product categories like Tweakers.net

  1. New Categories
    - Remove generic categories and add specific tech product types
    - Categories include: Smartphones, Tablets, Laptops, Headphones, etc.
    - Each category has a descriptive name and SEO-friendly slug

  2. Data Population
    - Insert comprehensive list of specific product categories
    - Categories are based on actual product types users search for
    - Follows Tweakers.net approach with granular categorization

  3. Security
    - Maintains existing RLS policies
    - Categories remain publicly readable
*/

-- Clear existing categories first
DELETE FROM categories;

-- Insert specific product categories like Tweakers.net
INSERT INTO categories (name, slug, description) VALUES
  -- Mobile & Communication
  ('Smartphones', 'smartphones', 'Mobile phones with advanced features and internet connectivity'),
  ('Feature Phones', 'feature-phones', 'Basic mobile phones with calling and texting capabilities'),
  ('Tablets', 'tablets', 'Portable touchscreen computers larger than smartphones'),
  ('Smartwatches', 'smartwatches', 'Wearable devices with smart features and connectivity'),
  ('E-readers', 'e-readers', 'Electronic devices designed primarily for reading digital books'),
  
  -- Computing
  ('Laptops', 'laptops', 'Portable personal computers for work and entertainment'),
  ('Desktop PCs', 'desktop-pcs', 'Stationary personal computers with full-size components'),
  ('Gaming PCs', 'gaming-pcs', 'High-performance computers optimized for gaming'),
  ('Monitors', 'monitors', 'External displays for computers and gaming consoles'),
  ('Keyboards', 'keyboards', 'Input devices for typing and computer control'),
  ('Mice', 'mice', 'Pointing devices for computer navigation and control'),
  ('Webcams', 'webcams', 'Cameras for video calls and streaming'),
  
  -- Audio & Video
  ('Headphones', 'headphones', 'Over-ear and on-ear audio devices'),
  ('Earbuds', 'earbuds', 'In-ear wireless and wired audio devices'),
  ('Speakers', 'speakers', 'Audio output devices for music and sound'),
  ('Soundbars', 'soundbars', 'Compact speaker systems for TV and home audio'),
  ('Microphones', 'microphones', 'Audio input devices for recording and streaming'),
  
  -- Gaming
  ('Gaming Consoles', 'gaming-consoles', 'Dedicated video game playing devices'),
  ('Gaming Controllers', 'gaming-controllers', 'Input devices for gaming consoles and PCs'),
  ('Gaming Headsets', 'gaming-headsets', 'Audio devices designed specifically for gaming'),
  ('Gaming Chairs', 'gaming-chairs', 'Ergonomic seating designed for extended gaming sessions'),
  
  -- TV & Entertainment
  ('Smart TVs', 'smart-tvs', 'Internet-connected televisions with streaming capabilities'),
  ('Streaming Devices', 'streaming-devices', 'Devices for streaming content to TVs'),
  ('Projectors', 'projectors', 'Display devices that project images onto screens or walls'),
  
  -- Photography
  ('Digital Cameras', 'digital-cameras', 'Cameras for photography and videography'),
  ('Action Cameras', 'action-cameras', 'Compact cameras for sports and adventure recording'),
  ('Camera Lenses', 'camera-lenses', 'Optical components for interchangeable lens cameras'),
  ('Tripods', 'tripods', 'Support equipment for stable camera positioning'),
  
  -- Smart Home
  ('Smart Speakers', 'smart-speakers', 'Voice-controlled speakers with AI assistants'),
  ('Security Cameras', 'security-cameras', 'Surveillance cameras for home monitoring'),
  ('Smart Lights', 'smart-lights', 'Internet-connected lighting systems'),
  ('Smart Thermostats', 'smart-thermostats', 'Programmable temperature control devices'),
  ('Robot Vacuums', 'robot-vacuums', 'Automated cleaning devices'),
  
  -- Storage & Memory
  ('External Hard Drives', 'external-hard-drives', 'Portable storage devices for data backup'),
  ('SSDs', 'ssds', 'Solid State Drives for fast data storage'),
  ('Memory Cards', 'memory-cards', 'Removable storage for cameras and devices'),
  ('USB Flash Drives', 'usb-flash-drives', 'Portable storage devices'),
  
  -- Networking
  ('Routers', 'routers', 'Network devices for internet connectivity'),
  ('Mesh Systems', 'mesh-systems', 'Whole-home WiFi coverage solutions'),
  ('Network Adapters', 'network-adapters', 'Devices for connecting to networks'),
  
  -- Power & Charging
  ('Power Banks', 'power-banks', 'Portable battery chargers for mobile devices'),
  ('Wireless Chargers', 'wireless-chargers', 'Cable-free charging solutions'),
  ('Charging Cables', 'charging-cables', 'Cables for device charging and data transfer'),
  
  -- Accessories
  ('Phone Cases', 'phone-cases', 'Protective covers for smartphones'),
  ('Screen Protectors', 'screen-protectors', 'Protective films for device screens'),
  ('Laptop Bags', 'laptop-bags', 'Carrying cases and backpacks for laptops'),
  ('Cable Management', 'cable-management', 'Solutions for organizing cables and wires');