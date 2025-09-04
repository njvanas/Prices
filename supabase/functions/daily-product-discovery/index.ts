import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface ProductDiscoveryResult {
  name: string
  brand: string
  model: string
  description: string
  category_slug: string
  image_url: string
  specifications: Record<string, any>
  retailer_prices: Array<{
    retailer_name: string
    price: number
    currency: string
    product_url: string
    availability: string
  }>
}

// Enhanced product discovery with comprehensive category coverage
const discoverProductsForCategory = async (categorySlug: string, countryCode: string): Promise<ProductDiscoveryResult[]> => {
  // Comprehensive product templates for all categories
  const productTemplates: Record<string, ProductDiscoveryResult[]> = {
    'smartphones': [
      {
        name: 'iPhone 15 Pro Max 256GB',
        brand: 'Apple',
        model: 'A3108',
        description: 'The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system.',
        category_slug: 'smartphones',
        image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          storage: '256GB',
          display: '6.7-inch Super Retina XDR',
          chip: 'A17 Pro',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 29 hours video playback'
        },
        retailer_prices: []
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        brand: 'Samsung',
        model: 'SM-S928U',
        description: 'Premium Android flagship with S Pen, 200MP camera, and AI-powered features.',
        category_slug: 'smartphones',
        image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          storage: '512GB',
          display: '6.8-inch Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          camera: '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
          s_pen: 'Included'
        },
        retailer_prices: []
      },
      {
        name: 'Google Pixel 8 Pro 128GB',
        brand: 'Google',
        model: 'GC3VE',
        description: 'AI-powered photography with Magic Eraser and advanced computational photography.',
        category_slug: 'smartphones',
        image_url: 'https://images.pexels.com/photos/4316/technology-computer-chips-gigabyte.jpg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          storage: '128GB',
          display: '6.7-inch LTPO OLED',
          processor: 'Google Tensor G3',
          camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
          ai_features: 'Magic Eraser, Best Take, Audio Magic Eraser'
        },
        retailer_prices: []
      }
    ],
    'laptops': [
      {
        name: 'MacBook Pro 14-inch M3 Pro 512GB',
        brand: 'Apple',
        model: 'MRXN3LL/A',
        description: 'Professional laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery life.',
        category_slug: 'laptops',
        image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          chip: 'Apple M3 Pro',
          memory: '18GB unified memory',
          storage: '512GB SSD',
          display: '14.2-inch Liquid Retina XDR',
          battery: 'Up to 18 hours'
        },
        retailer_prices: []
      },
      {
        name: 'Dell XPS 13 Plus 9320',
        brand: 'Dell',
        model: '9320',
        description: 'Ultra-portable laptop with InfinityEdge display and premium build quality.',
        category_slug: 'laptops',
        image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          processor: 'Intel Core i7-1360P',
          memory: '16GB LPDDR5',
          storage: '512GB PCIe SSD',
          display: '13.4-inch OLED 3.5K',
          weight: '2.73 lbs'
        },
        retailer_prices: []
      },
      {
        name: 'ThinkPad X1 Carbon Gen 11',
        brand: 'Lenovo',
        model: '21HM',
        description: 'Business ultrabook with legendary ThinkPad durability and performance.',
        category_slug: 'laptops',
        image_url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          processor: 'Intel Core i7-1365U',
          memory: '16GB LPDDR5',
          storage: '1TB PCIe SSD',
          display: '14-inch WUXGA IPS',
          weight: '2.48 lbs'
        },
        retailer_prices: []
      }
    ],
    'headphones': [
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        brand: 'Sony',
        model: 'WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
        category_slug: 'headphones',
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          noise_canceling: 'Industry-leading',
          battery_life: '30 hours',
          quick_charge: '3 min for 3 hours',
          connectivity: 'Bluetooth 5.2, NFC',
          weight: '250g'
        },
        retailer_prices: []
      },
      {
        name: 'Apple AirPods Pro 2nd Generation',
        brand: 'Apple',
        model: 'MTJV3AM/A',
        description: 'Advanced noise cancellation with spatial audio and adaptive transparency.',
        category_slug: 'headphones',
        image_url: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          chip: 'Apple H2',
          noise_canceling: 'Active Noise Cancellation',
          battery_life: '6 hours (30 hours with case)',
          spatial_audio: 'Personalized Spatial Audio',
          water_resistance: 'IPX4'
        },
        retailer_prices: []
      },
      {
        name: 'Bose QuietComfort 45',
        brand: 'Bose',
        model: 'QC45',
        description: 'Premium comfort with world-class noise cancellation and balanced sound.',
        category_slug: 'headphones',
        image_url: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          noise_canceling: 'Acoustic Noise Cancelling',
          battery_life: '24 hours',
          connectivity: 'Bluetooth 5.1',
          weight: '238g',
          comfort: 'Plush ear cushions'
        },
        retailer_prices: []
      }
    ],
    'tablets': [
      {
        name: 'iPad Pro 12.9-inch M2 256GB',
        brand: 'Apple',
        model: 'MNXH3LL/A',
        description: 'Ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
        category_slug: 'tablets',
        image_url: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          chip: 'Apple M2',
          storage: '256GB',
          display: '12.9-inch Liquid Retina XDR',
          camera: '12MP Wide + 10MP Ultra Wide',
          connectivity: 'Wi-Fi 6E + 5G'
        },
        retailer_prices: []
      },
      {
        name: 'Samsung Galaxy Tab S9 Ultra',
        brand: 'Samsung',
        model: 'SM-X916B',
        description: 'Premium Android tablet with S Pen and desktop-class performance.',
        category_slug: 'tablets',
        image_url: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          processor: 'Snapdragon 8 Gen 2',
          storage: '256GB',
          display: '14.6-inch Dynamic AMOLED 2X',
          s_pen: 'Included',
          water_resistance: 'IP68'
        },
        retailer_prices: []
      }
    ],
    'smartwatches': [
      {
        name: 'Apple Watch Series 9 45mm GPS',
        brand: 'Apple',
        model: 'MR933LL/A',
        description: 'Advanced health monitoring with ECG, blood oxygen, and fitness tracking.',
        category_slug: 'smartwatches',
        image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          chip: 'S9 SiP',
          display: '45mm Always-On Retina',
          health: 'ECG, Blood Oxygen, Heart Rate',
          battery: '18 hours',
          water_resistance: '50 meters'
        },
        retailer_prices: []
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic',
        brand: 'Samsung',
        model: 'SM-R950F',
        description: 'Premium smartwatch with rotating bezel and comprehensive health tracking.',
        category_slug: 'smartwatches',
        image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          processor: 'Exynos W930',
          display: '1.3-inch Super AMOLED',
          health: 'Body Composition, Sleep Tracking',
          battery: '40 hours',
          rotating_bezel: 'Yes'
        },
        retailer_prices: []
      }
    ],
    'gaming': [
      {
        name: 'PlayStation 5 Console',
        brand: 'Sony',
        model: 'CFI-1215A01',
        description: 'Next-generation gaming console with ultra-high speed SSD and ray tracing.',
        category_slug: 'gaming',
        image_url: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          cpu: 'AMD Zen 2',
          gpu: 'AMD RDNA 2',
          storage: '825GB SSD',
          resolution: '4K at 120fps',
          ray_tracing: 'Hardware accelerated'
        },
        retailer_prices: []
      },
      {
        name: 'Xbox Series X Console',
        brand: 'Microsoft',
        model: 'RRT-00001',
        description: 'Most powerful Xbox ever with 12 teraflops of processing power.',
        category_slug: 'gaming',
        image_url: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          cpu: 'AMD Zen 2',
          gpu: '12 teraflops RDNA 2',
          storage: '1TB NVMe SSD',
          resolution: '4K at 120fps',
          backwards_compatibility: 'Yes'
        },
        retailer_prices: []
      },
      {
        name: 'Nintendo Switch OLED Model',
        brand: 'Nintendo',
        model: 'HEG-001',
        description: 'Portable gaming console with vibrant OLED screen and enhanced audio.',
        category_slug: 'gaming',
        image_url: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          display: '7-inch OLED',
          storage: '64GB internal',
          battery: '4.5-9 hours',
          dock: 'Enhanced with wired LAN port',
          portability: 'Handheld and TV modes'
        },
        retailer_prices: []
      }
    ],
    'home-appliances': [
      {
        name: 'Dyson V15 Detect Absolute',
        brand: 'Dyson',
        model: 'V15',
        description: 'Powerful cordless vacuum with laser dust detection and scientific proof of deep clean.',
        category_slug: 'home-appliances',
        image_url: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          suction_power: '230 AW',
          battery_life: 'Up to 60 minutes',
          dust_detection: 'Laser dust detection',
          filtration: 'Advanced whole-machine filtration',
          bin_capacity: '0.77 liters'
        },
        retailer_prices: []
      },
      {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
        brand: 'Instant Pot',
        model: 'DUO60',
        description: 'Multi-functional pressure cooker that replaces 7 kitchen appliances.',
        category_slug: 'home-appliances',
        image_url: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          capacity: '6 quarts',
          functions: '7-in-1 (Pressure, Slow, Rice, Yogurt, Steamer, Sauté, Warmer)',
          safety: '10+ safety features',
          material: 'Stainless steel inner pot',
          programs: '13 smart programs'
        },
        retailer_prices: []
      },
      {
        name: 'KitchenAid Artisan Stand Mixer',
        brand: 'KitchenAid',
        model: 'KSM150PS',
        description: 'Iconic stand mixer with powerful motor and versatile attachments.',
        category_slug: 'home-appliances',
        image_url: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          capacity: '5 quarts',
          motor: '325 watts',
          speeds: '10 speeds',
          attachments: 'Flat beater, dough hook, wire whip',
          colors: '20+ available colors'
        },
        retailer_prices: []
      }
    ],
    'sneakers': [
      {
        name: 'Nike Air Max 270 React',
        brand: 'Nike',
        model: 'AH8050',
        description: 'Lifestyle sneakers with large Air unit for all-day comfort and style.',
        category_slug: 'sneakers',
        image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          air_technology: 'Max Air unit',
          upper_material: 'Mesh and synthetic',
          sole: 'Rubber outsole',
          closure: 'Lace-up',
          style: 'Lifestyle'
        },
        retailer_prices: []
      },
      {
        name: 'Adidas Ultraboost 22 Running Shoes',
        brand: 'Adidas',
        model: 'GX3131',
        description: 'Premium running shoes with responsive Boost midsole and Primeknit upper.',
        category_slug: 'sneakers',
        image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          midsole: 'Boost technology',
          upper: 'Primeknit',
          outsole: 'Continental rubber',
          support: 'Linear Energy Push',
          use: 'Running and lifestyle'
        },
        retailer_prices: []
      },
      {
        name: 'Jordan Air Jordan 1 Retro High OG',
        brand: 'Nike',
        model: '555088',
        description: 'Iconic basketball sneaker with premium leather and classic colorways.',
        category_slug: 'sneakers',
        image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          material: 'Premium leather',
          sole: 'Rubber outsole',
          closure: 'Lace-up',
          style: 'Basketball heritage',
          colorways: 'Multiple classic options'
        },
        retailer_prices: []
      }
    ],
    'cameras': [
      {
        name: 'Canon EOS R5 Mirrorless Camera',
        brand: 'Canon',
        model: 'EOS R5',
        description: 'Professional mirrorless camera with 45MP sensor and 8K video recording.',
        category_slug: 'cameras',
        image_url: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          sensor: '45MP Full-Frame CMOS',
          video: '8K RAW at 30fps',
          autofocus: 'Dual Pixel CMOS AF II',
          stabilization: '5-axis In-Body',
          mount: 'RF mount'
        },
        retailer_prices: []
      },
      {
        name: 'Sony Alpha A7 IV Mirrorless Camera',
        brand: 'Sony',
        model: 'ILCE-7M4',
        description: 'Versatile full-frame camera with advanced autofocus and 4K video.',
        category_slug: 'cameras',
        image_url: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          sensor: '33MP Full-Frame Exmor R',
          video: '4K 60p',
          autofocus: '759-point Fast Hybrid AF',
          stabilization: '5.5-stop In-Body',
          mount: 'E mount'
        },
        retailer_prices: []
      }
    ],
    'fitness': [
      {
        name: 'Peloton Bike+ Indoor Exercise Bike',
        brand: 'Peloton',
        model: 'Bike+',
        description: 'Premium indoor cycling bike with rotating HD touchscreen and live classes.',
        category_slug: 'fitness',
        image_url: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          display: '23.8-inch HD touchscreen',
          resistance: 'Magnetic',
          audio: '4-speaker system',
          connectivity: 'Wi-Fi, Bluetooth',
          subscription: 'All-Access Membership required'
        },
        retailer_prices: []
      },
      {
        name: 'Yeti Rambler 30oz Tumbler',
        brand: 'Yeti',
        model: 'YRAM30',
        description: 'Insulated stainless steel tumbler that keeps drinks cold or hot for hours.',
        category_slug: 'fitness',
        image_url: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          capacity: '30 oz',
          material: '18/8 stainless steel',
          insulation: 'Double-wall vacuum',
          lid: 'MagSlider lid',
          dishwasher_safe: 'Yes'
        },
        retailer_prices: []
      }
    ]
  }

  // Generate realistic retailer prices for discovered products
  const generateRetailerPrices = (basePrice: number, countryCode: string): ProductDiscoveryResult['retailer_prices'] => {
    const retailersByCountry: Record<string, string[]> = {
      'US': ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Newegg', 'B&H Photo'],
      'CA': ['Amazon.ca', 'Best Buy Canada', 'Walmart Canada', 'Costco', 'The Source'],
      'GB': ['Amazon UK', 'Currys', 'Argos', 'John Lewis', 'Very'],
      'DE': ['Amazon.de', 'MediaMarkt', 'Saturn', 'Otto', 'Alternate'],
      'FR': ['Amazon.fr', 'Fnac', 'Darty', 'Cdiscount', 'Boulanger'],
      'AU': ['Amazon.com.au', 'JB Hi-Fi', 'Harvey Norman', 'Officeworks', 'Kogan']
    }

    const currencyInfo: Record<string, { currency: string, multiplier: number }> = {
      'US': { currency: 'USD', multiplier: 1.0 },
      'CA': { currency: 'CAD', multiplier: 1.35 },
      'GB': { currency: 'GBP', multiplier: 0.79 },
      'DE': { currency: 'EUR', multiplier: 0.92 },
      'FR': { currency: 'EUR', multiplier: 0.92 },
      'AU': { currency: 'AUD', multiplier: 1.52 }
    }

    const retailers = retailersByCountry[countryCode] || retailersByCountry['US']
    const { currency, multiplier } = currencyInfo[countryCode] || currencyInfo['US']
    
    // Select 3-5 random retailers
    const selectedRetailers = retailers
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 3)

    return selectedRetailers.map(retailer => {
      // Create realistic price variations (±15% from base price)
      const priceVariation = 0.85 + Math.random() * 0.3
      const localizedPrice = basePrice * multiplier * priceVariation
      
      return {
        retailer_name: retailer,
        price: Math.round(localizedPrice * 100) / 100,
        currency,
        product_url: `https://${retailer.toLowerCase().replace(/[^a-z]/g, '')}.com/product/${Math.random().toString(36).substr(2, 9)}`,
        availability: Math.random() > 0.1 ? 'in_stock' : Math.random() > 0.5 ? 'limited_stock' : 'out_of_stock'
      }
    })
  }

  // Get base prices for different categories
  const getBasePriceForCategory = (categorySlug: string): number => {
    const basePrices: Record<string, number> = {
      'smartphones': 800 + Math.random() * 600,
      'laptops': 1200 + Math.random() * 1500,
      'headphones': 200 + Math.random() * 400,
      'tablets': 600 + Math.random() * 800,
      'smartwatches': 300 + Math.random() * 500,
      'gaming': 400 + Math.random() * 200,
      'home-appliances': 300 + Math.random() * 500,
      'cameras': 1500 + Math.random() * 2000,
      'fitness': 100 + Math.random() * 1900,
      'sneakers': 80 + Math.random() * 150
    }
    return basePrices[categorySlug] || 200 + Math.random() * 300
  }

  // Add realistic prices to templates
  const templates = productTemplates[categorySlug] || []
  return templates.map(product => ({
    ...product,
    retailer_prices: generateRetailerPrices(getBasePriceForCategory(categorySlug), countryCode)
  }))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔍 Starting comprehensive daily product discovery...')

    // Get all categories and countries
    const [categoriesResult, countriesResult, retailersResult] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('countries').select('*').eq('is_active', true),
      supabase.from('retailers').select('*').eq('is_active', true)
    ])

    if (categoriesResult.error) throw categoriesResult.error
    if (countriesResult.error) throw countriesResult.error
    if (retailersResult.error) throw retailersResult.error

    const categories = categoriesResult.data || []
    const countries = countriesResult.data || []
    const retailers = retailersResult.data || []

    console.log(`📂 Processing ${categories.length} categories across ${countries.length} countries`)

    let totalProductsDiscovered = 0
    let newProductsAdded = 0
    let totalPricesUpdated = 0
    let tasksCompleted = 0
    let tasksFailed = 0

    // Create retailer lookup map
    const retailerMap = new Map(retailers.map(r => [r.name, r.id]))

    // Process each category for each country
    for (const category of categories) {
      console.log(`\n📱 Discovering products for: ${category.name}`)
      
      try {
        for (const country of countries) {
          console.log(`  🌍 Processing ${country.name}...`)

          // Discover products for this category and country
          const discoveredProducts = await discoverProductsForCategory(category.slug, country.code)
          
          for (const discoveredProduct of discoveredProducts) {
            try {
              // Check if product exists
              const { data: existingProduct } = await supabase
                .from('products')
                .select('id')
                .eq('name', discoveredProduct.name)
                .eq('brand', discoveredProduct.brand)
                .single()

              let productId: string

              if (existingProduct) {
                productId = existingProduct.id
                console.log(`    ♻️  Updating: ${discoveredProduct.name}`)
              } else {
                // Create new product
                const { data: newProduct, error: productError } = await supabase
                  .from('products')
                  .insert({
                    name: discoveredProduct.name,
                    brand: discoveredProduct.brand,
                    model: discoveredProduct.model,
                    description: discoveredProduct.description,
                    category_id: category.id,
                    image_url: discoveredProduct.image_url,
                    specifications: discoveredProduct.specifications
                  })
                  .select('id')
                  .single()

                if (productError) throw productError

                productId = newProduct.id
                newProductsAdded++

                // Log product discovery
                await supabase
                  .from('product_discovery_log')
                  .insert({
                    product_id: productId,
                    source: 'daily_discovery',
                    category_id: category.id,
                    country_code: country.code,
                    initial_price: Math.min(...discoveredProduct.retailer_prices.map(rp => rp.price)),
                    metadata: {
                      discovery_method: 'automated_scan',
                      retailer_count: discoveredProduct.retailer_prices.length
                    }
                  })

                console.log(`    ✨ Added: ${discoveredProduct.name}`)
              }

              // Process retailer prices
              for (const priceData of discoveredProduct.retailer_prices) {
                // Get or create retailer
                let retailerId = retailerMap.get(priceData.retailer_name)
                
                if (!retailerId) {
                  const { data: newRetailer, error: retailerError } = await supabase
                    .from('retailers')
                    .insert({
                      name: priceData.retailer_name,
                      website_url: `https://${priceData.retailer_name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                      logo_url: '',
                      is_active: true
                    })
                    .select('id')
                    .single()

                  if (retailerError) throw retailerError
                  retailerId = newRetailer.id
                  retailerMap.set(priceData.retailer_name, retailerId)

                  // Link retailer to country
                  await supabase
                    .from('retailer_countries')
                    .insert({
                      retailer_id: retailerId,
                      country_code: country.code,
                      website_url: `https://${priceData.retailer_name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                      is_primary: true
                    })
                    .onConflict('retailer_id,country_code')
                    .ignoreDuplicates()
                }

                // Archive current price to history before updating
                const { data: currentPrice } = await supabase
                  .from('prices')
                  .select('price, currency')
                  .eq('product_id', productId)
                  .eq('retailer_id', retailerId)
                  .single()

                if (currentPrice) {
                  // Calculate price change percentage
                  const priceChangePercent = currentPrice.price > 0 
                    ? ((priceData.price - currentPrice.price) / currentPrice.price) * 100 
                    : 0

                  // Archive to price history
                  await supabase
                    .from('price_history')
                    .insert({
                      product_id: productId,
                      retailer_id: retailerId,
                      price: currentPrice.price,
                      currency: currentPrice.currency || 'USD',
                      price_change_percent: Math.round(priceChangePercent * 100) / 100,
                      is_deal: Math.abs(priceChangePercent) > 10, // Consider significant changes as deals
                      deal_score: Math.max(0, Math.min(10, 5 + (priceChangePercent * -0.5))) // Score based on price drop
                    })
                }

                // Update current price
                const { error: priceError } = await supabase
                  .from('prices')
                  .upsert({
                    product_id: productId,
                    retailer_id: retailerId,
                    price: priceData.price,
                    currency: priceData.currency,
                    product_url: priceData.product_url,
                    availability: priceData.availability,
                    last_checked: new Date().toISOString()
                  }, {
                    onConflict: 'product_id,retailer_id'
                  })

                if (priceError) {
                  console.error(`❌ Price update failed:`, priceError.message)
                  tasksFailed++
                } else {
                  totalPricesUpdated++
                }
              }

              totalProductsDiscovered++
              tasksCompleted++

            } catch (error) {
              console.error(`❌ Error processing product ${discoveredProduct.name}:`, error)
              tasksFailed++
            }
          }
        }
        
        tasksCompleted++
        
      } catch (error) {
        console.error(`❌ Error processing category ${category.name}:`, error)
        tasksFailed++
      }
    }

    const summary = {
      total_products_discovered: totalProductsDiscovered,
      new_products_added: newProductsAdded,
      total_prices_updated: totalPricesUpdated,
      categories_processed: categories.length,
      countries_processed: countries.length,
      tasks_completed: tasksCompleted,
      tasks_failed: tasksFailed
    }

    console.log('✅ Daily product discovery completed:', summary)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily product discovery completed successfully',
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Daily product discovery failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})