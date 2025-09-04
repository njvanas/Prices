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

// Simulated product discovery service (in real implementation, this would scrape retailer APIs)
const discoverProductsForCategory = async (categorySlug: string, countryCode: string): Promise<ProductDiscoveryResult[]> => {
  // This simulates discovering new products from various retailers
  // In production, this would integrate with retailer APIs or web scraping services
  
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
      }
    ],
    'laptops': [
      {
        name: 'MacBook Pro 14-inch M3 Pro',
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
        name: 'Dell XPS 13 Plus',
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
      }
    ],
    'headphones': [
      {
        name: 'Sony WH-1000XM5',
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
        name: 'Apple AirPods Pro 2nd Gen',
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
      }
    ],
    'home-appliances': [
      {
        name: 'Dyson V15 Detect',
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
      }
    ],
    'sneakers': [
      {
        name: 'Nike Air Max 270',
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
      }
    ]
  }

  // Generate realistic retailer prices for discovered products
  const generateRetailerPrices = (basePrice: number, countryCode: string): ProductDiscoveryResult['retailer_prices'] => {
    const retailers = ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Newegg']
    const currency = countryCode === 'US' ? 'USD' : countryCode === 'CA' ? 'CAD' : 'EUR'
    
    return retailers.slice(0, Math.floor(Math.random() * 3) + 2).map(retailer => ({
      retailer_name: retailer,
      price: basePrice * (0.9 + Math.random() * 0.2), // ±10% price variation
      currency,
      product_url: `https://${retailer.toLowerCase().replace(' ', '')}.com/product/${Math.random().toString(36).substr(2, 9)}`,
      availability: Math.random() > 0.1 ? 'in_stock' : 'limited_stock'
    }))
  }

  // Add realistic prices to templates
  Object.keys(productTemplates).forEach(category => {
    productTemplates[category].forEach(product => {
      const basePrices: Record<string, number> = {
        'smartphones': 800 + Math.random() * 400,
        'laptops': 1200 + Math.random() * 800,
        'headphones': 200 + Math.random() * 300,
        'home-appliances': 300 + Math.random() * 400,
        'sneakers': 80 + Math.random() * 120
      }
      product.retailer_prices = generateRetailerPrices(basePrices[category] || 100, countryCode)
    })
  })

  return productTemplates[categorySlug] || []
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

    console.log('🔍 Starting daily product discovery...')

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError

    // Get all active countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)

    if (countriesError) throw countriesError

    let totalProductsDiscovered = 0
    let totalPricesAdded = 0
    const discoveryLog = []

    // Process each category for each country
    for (const category of categories || []) {
      for (const country of countries || []) {
        console.log(`🔍 Discovering products for ${category.name} in ${country.name}...`)

        try {
          // Discover new products for this category/country combination
          const discoveredProducts = await discoverProductsForCategory(category.slug, country.code)

          for (const discoveredProduct of discoveredProducts) {
            // Check if product already exists
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('name', discoveredProduct.name)
              .eq('brand', discoveredProduct.brand)
              .single()

            let productId: string

            if (existingProduct) {
              productId = existingProduct.id
              console.log(`✅ Product already exists: ${discoveredProduct.name}`)
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
              totalProductsDiscovered++

              console.log(`🆕 Created new product: ${discoveredProduct.name}`)

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
            }

            // Process retailer prices
            for (const retailerPrice of discoveredProduct.retailer_prices) {
              // Get or create retailer
              let { data: retailer } = await supabase
                .from('retailers')
                .select('id')
                .eq('name', retailerPrice.retailer_name)
                .single()

              if (!retailer) {
                const { data: newRetailer, error: retailerError } = await supabase
                  .from('retailers')
                  .insert({
                    name: retailerPrice.retailer_name,
                    website_url: `https://${retailerPrice.retailer_name.toLowerCase().replace(' ', '')}.com`,
                    logo_url: '',
                    is_active: true
                  })
                  .select('id')
                  .single()

                if (retailerError) throw retailerError
                retailer = newRetailer

                // Link retailer to country
                await supabase
                  .from('retailer_countries')
                  .insert({
                    retailer_id: retailer.id,
                    country_code: country.code,
                    website_url: `https://${retailerPrice.retailer_name.toLowerCase().replace(' ', '')}.com`,
                    is_primary: true
                  })
                  .onConflict('retailer_id,country_code')
                  .ignoreDuplicates()
              }

              // Update or insert current price
              const { error: priceError } = await supabase
                .from('prices')
                .upsert({
                  product_id: productId,
                  retailer_id: retailer.id,
                  price: retailerPrice.price,
                  currency: retailerPrice.currency,
                  product_url: retailerPrice.product_url,
                  availability: retailerPrice.availability,
                  last_checked: new Date().toISOString()
                }, {
                  onConflict: 'product_id,retailer_id'
                })

              if (priceError) throw priceError
              totalPricesAdded++
            }
          }

          discoveryLog.push({
            category: category.name,
            country: country.name,
            products_found: discoveredProducts.length,
            status: 'success'
          })

        } catch (error) {
          console.error(`❌ Error processing ${category.name} in ${country.name}:`, error)
          discoveryLog.push({
            category: category.name,
            country: country.name,
            products_found: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    const summary = {
      total_products_discovered: totalProductsDiscovered,
      total_prices_updated: totalPricesAdded,
      categories_processed: categories?.length || 0,
      countries_processed: countries?.length || 0,
      discovery_log: discoveryLog
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