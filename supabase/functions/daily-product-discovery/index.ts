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
          processor: 'Apple M3 Pro 11-core CPU',
          memory: '18GB unified memory',
          storage: '512GB SSD',
          display: '14.2-inch Liquid Retina XDR',
          graphics: '14-core GPU'
        },
        retailer_prices: []
      },
      {
        name: 'Dell XPS 13 Plus',
        brand: 'Dell',
        model: 'XPS9320',
        description: 'Ultra-thin laptop with InfinityEdge display and premium build quality.',
        category_slug: 'laptops',
        image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          processor: 'Intel Core i7-1360P',
          memory: '16GB LPDDR5',
          storage: '512GB PCIe SSD',
          display: '13.4-inch FHD+ InfinityEdge',
          graphics: 'Intel Iris Xe'
        },
        retailer_prices: []
      }
    ],
    'headphones': [
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        brand: 'Sony',
        model: 'WH1000XM5',
        description: 'Industry-leading noise canceling with exceptional sound quality and 30-hour battery life.',
        category_slug: 'headphones',
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          type: 'Over-ear wireless',
          noise_canceling: 'Active noise canceling',
          battery_life: '30 hours',
          connectivity: 'Bluetooth 5.2, USB-C',
          weight: '250g'
        },
        retailer_prices: []
      },
      {
        name: 'Apple AirPods Pro 2nd Generation',
        brand: 'Apple',
        model: 'MTJV3AM/A',
        description: 'Premium wireless earbuds with adaptive transparency and personalized spatial audio.',
        category_slug: 'headphones',
        image_url: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400',
        specifications: {
          type: 'In-ear wireless',
          noise_canceling: 'Active noise canceling',
          battery_life: '6 hours + 24 hours with case',
          connectivity: 'Bluetooth 5.3, Lightning/USB-C',
          features: 'Spatial Audio, Adaptive Transparency'
        },
        retailer_prices: []
      }
    ]
  }

  // Generate realistic prices for different retailers
  const generateRetailerPrices = (basePrice: number, countryCode: string) => {
    const retailers = ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Newegg']
    const currency = countryCode === 'US' ? 'USD' : countryCode === 'CA' ? 'CAD' : 'EUR'
    
    return retailers.map(retailer => ({
      retailer_name: retailer,
      price: basePrice * (0.85 + Math.random() * 0.3), // ±15% price variation
      currency,
      product_url: `https://${retailer.toLowerCase().replace(' ', '')}.com/product-${Math.random().toString(36).substr(2, 9)}`,
      availability: Math.random() > 0.1 ? 'in_stock' : 'limited_stock'
    }))
  }

  // Base prices for different product types
  const basePrices: Record<string, number> = {
    'iPhone 15 Pro Max 256GB': 1199,
    'Samsung Galaxy S24 Ultra 512GB': 1299,
    'MacBook Pro 14-inch M3 Pro': 1999,
    'Dell XPS 13 Plus': 1299,
    'Sony WH-1000XM5 Wireless Headphones': 399,
    'Apple AirPods Pro 2nd Generation': 249
  }

  const categoryProducts = productTemplates[categorySlug] || []
  
  return categoryProducts.map(product => ({
    ...product,
    retailer_prices: generateRetailerPrices(basePrices[product.name] || 299, countryCode)
  }))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔍 Starting daily product discovery and data fetching...')

    // Get all active categories and countries
    const [categoriesResult, countriesResult] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('countries').select('*').eq('is_active', true)
    ])

    if (categoriesResult.error) throw categoriesResult.error
    if (countriesResult.error) throw countriesResult.error

    const categories = categoriesResult.data || []
    const countries = countriesResult.data || []

    console.log(`📂 Processing ${categories.length} categories across ${countries.length} countries`)

    let totalProductsProcessed = 0
    let totalPricesUpdated = 0
    let newProductsAdded = 0

    // Process each category for each country
    for (const category of categories) {
      console.log(`\n📱 Processing category: ${category.name}`)
      
      for (const country of countries) {
        console.log(`  🌍 Country: ${country.name} (${country.code})`)

        try {
          // Discover new products for this category and country
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
              console.log(`    ♻️  Updating existing product: ${discoveredProduct.name}`)
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

              if (productError) {
                console.error(`❌ Error creating product ${discoveredProduct.name}:`, productError.message)
                continue
              }

              productId = newProduct.id
              newProductsAdded++
              console.log(`    ✨ Added new product: ${discoveredProduct.name}`)
            }

            // Get retailers for this country
            const { data: countryRetailers } = await supabase
              .from('retailer_countries')
              .select(`
                retailer_id,
                retailers!inner(id, name, is_active)
              `)
              .eq('country_code', country.code)
              .eq('retailers.is_active', true)

            const retailerMap = new Map(
              countryRetailers?.map(rc => [rc.retailers.name, rc.retailer_id]) || []
            )

            // Process prices for each retailer
            for (const priceData of discoveredProduct.retailer_prices) {
              const retailerId = retailerMap.get(priceData.retailer_name)
              if (!retailerId) continue

              // Archive current price to history before updating
              const { data: currentPrice } = await supabase
                .from('prices')
                .select('price')
                .eq('product_id', productId)
                .eq('retailer_id', retailerId)
                .single()

              if (currentPrice) {
                // Archive the current price to history
                await supabase
                  .from('price_history')
                  .insert({
                    product_id: productId,
                    retailer_id: retailerId,
                    price: currentPrice.price,
                    currency: priceData.currency
                  })
              }

              // Update or insert current price
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
                console.error(`❌ Error updating price for ${priceData.retailer_name}:`, priceError.message)
              } else {
                totalPricesUpdated++
              }
            }

            totalProductsProcessed++
          }
        } catch (error) {
          console.error(`❌ Error processing ${category.name} in ${country.name}:`, error)
        }
      }
    }

    // Clean up old price history (keep last 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { error: cleanupError } = await supabase
      .from('price_history')
      .delete()
      .lt('recorded_at', ninetyDaysAgo.toISOString())

    if (cleanupError) {
      console.error('❌ Error cleaning up old price history:', cleanupError.message)
    } else {
      console.log('🧹 Cleaned up price history older than 90 days')
    }

    // Trigger featured deals update
    console.log('\n🏆 Triggering featured deals update...')
    const dealsUpdateUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/global-deals-update`
    const dealsResponse = await fetch(dealsUpdateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!dealsResponse.ok) {
      console.error('❌ Failed to trigger deals update')
    } else {
      console.log('✅ Featured deals update triggered successfully')
    }

    const summary = {
      message: 'Daily product discovery completed successfully',
      stats: {
        categories_processed: categories.length,
        countries_processed: countries.length,
        total_products_processed: totalProductsProcessed,
        new_products_added: newProductsAdded,
        total_prices_updated: totalPricesUpdated,
        timestamp: new Date().toISOString()
      }
    }

    console.log('\n📊 Daily Discovery Summary:')
    console.log(`   📂 Categories processed: ${categories.length}`)
    console.log(`   🌍 Countries processed: ${countries.length}`)
    console.log(`   📦 Products processed: ${totalProductsProcessed}`)
    console.log(`   ✨ New products added: ${newProductsAdded}`)
    console.log(`   💰 Prices updated: ${totalPricesUpdated}`)

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error in daily product discovery:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to complete daily product discovery',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})