import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface RetailerAPI {
  name: string
  baseUrl: string
  searchEndpoint: string
  priceSelector: string
  titleSelector: string
  imageSelector: string
}

// Simulated retailer API configurations
const RETAILER_APIS: RetailerAPI[] = [
  {
    name: 'Amazon',
    baseUrl: 'https://amazon.com',
    searchEndpoint: '/s?k={query}&ref=sr_pg_1',
    priceSelector: '.a-price-whole',
    titleSelector: '[data-component-type="s-search-result"] h2',
    imageSelector: '.s-image'
  },
  {
    name: 'Best Buy',
    baseUrl: 'https://bestbuy.com',
    searchEndpoint: '/site/searchpage.jsp?st={query}',
    priceSelector: '.pricing-current-price',
    titleSelector: '.sku-title',
    imageSelector: '.product-image'
  },
  {
    name: 'Target',
    baseUrl: 'https://target.com',
    searchEndpoint: '/s?searchTerm={query}',
    priceSelector: '[data-test="product-price"]',
    titleSelector: '[data-test="product-title"]',
    imageSelector: '[data-test="product-image"]'
  }
]

// Enhanced product discovery with AI-powered categorization
const discoverProductsWithAI = async (categorySlug: string, countryCode: string, limit: number = 20) => {
  // This simulates AI-powered product discovery across multiple retailers
  // In production, this would use web scraping, retailer APIs, and AI for categorization
  
  const searchTerms: Record<string, string[]> = {
    'smartphones': ['iPhone 15', 'Samsung Galaxy S24', 'Google Pixel 8', 'OnePlus 12', 'Xiaomi 14'],
    'laptops': ['MacBook Pro', 'Dell XPS', 'ThinkPad X1', 'Surface Laptop', 'HP Spectre'],
    'headphones': ['Sony WH-1000XM5', 'AirPods Pro', 'Bose QuietComfort', 'Sennheiser Momentum', 'Audio-Technica ATH'],
    'tablets': ['iPad Pro', 'Samsung Galaxy Tab', 'Surface Pro', 'iPad Air', 'Lenovo Tab'],
    'smartwatches': ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin Forerunner', 'Fitbit Sense', 'Amazfit GTR'],
    'gaming': ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck', 'Gaming Laptop'],
    'home-appliances': ['Dyson Vacuum', 'Instant Pot', 'KitchenAid Mixer', 'Ninja Blender', 'Roomba'],
    'cameras': ['Canon EOS R5', 'Sony A7 IV', 'Nikon Z9', 'Fujifilm X-T5', 'GoPro Hero 12']
  }

  const terms = searchTerms[categorySlug] || ['popular products']
  const discoveredProducts = []

  for (const term of terms) {
    // Simulate discovering products for each search term
    const basePrice = 200 + Math.random() * 1500
    const productVariations = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < productVariations; i++) {
      const product = {
        name: `${term} ${i > 0 ? `(${['Pro', 'Plus', 'Ultra'][i - 1]})` : ''}`,
        brand: term.split(' ')[0],
        model: `${term.replace(/\s+/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        description: `Premium ${categorySlug.replace('-', ' ')} with advanced features and excellent performance.`,
        category_slug: categorySlug,
        image_url: getRandomProductImage(categorySlug),
        specifications: generateSpecifications(categorySlug),
        retailer_prices: generateRetailerPrices(basePrice, countryCode)
      }
      
      discoveredProducts.push(product)
    }
  }

  return discoveredProducts.slice(0, limit)
}

const getRandomProductImage = (categorySlug: string): string => {
  const imageUrls: Record<string, string[]> = {
    'smartphones': [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4316/technology-computer-chips-gigabyte.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    'laptops': [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    'headphones': [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  }
  
  const categoryImages = imageUrls[categorySlug] || imageUrls['smartphones']
  return categoryImages[Math.floor(Math.random() * categoryImages.length)]
}

const generateSpecifications = (categorySlug: string): Record<string, any> => {
  const specs: Record<string, Record<string, any>> = {
    'smartphones': {
      display: `${(5.5 + Math.random() * 2).toFixed(1)}-inch OLED`,
      storage: `${[128, 256, 512, 1024][Math.floor(Math.random() * 4)]}GB`,
      camera: `${[48, 64, 108, 200][Math.floor(Math.random() * 4)]}MP Main Camera`,
      battery: `${3000 + Math.floor(Math.random() * 2000)}mAh`,
      os: Math.random() > 0.5 ? 'iOS' : 'Android'
    },
    'laptops': {
      processor: ['Intel Core i7', 'AMD Ryzen 7', 'Apple M3', 'Intel Core i5'][Math.floor(Math.random() * 4)],
      memory: `${[8, 16, 32][Math.floor(Math.random() * 3)]}GB RAM`,
      storage: `${[256, 512, 1024][Math.floor(Math.random() * 3)]}GB SSD`,
      display: `${(13 + Math.random() * 4).toFixed(1)}-inch`,
      weight: `${(1.2 + Math.random() * 1.5).toFixed(1)}kg`
    },
    'headphones': {
      type: Math.random() > 0.5 ? 'Over-ear' : 'In-ear',
      noise_canceling: Math.random() > 0.3 ? 'Active' : 'Passive',
      battery_life: `${Math.floor(20 + Math.random() * 20)} hours`,
      connectivity: 'Bluetooth 5.0+',
      weight: `${Math.floor(200 + Math.random() * 300)}g`
    }
  }
  
  return specs[categorySlug] || specs['smartphones']
}

const generateRetailerPrices = (basePrice: number, countryCode: string) => {
  const retailers = ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Newegg', 'B&H Photo']
  const currency = countryCode === 'US' ? 'USD' : countryCode === 'CA' ? 'CAD' : 'EUR'
  const currencyMultiplier = countryCode === 'CA' ? 1.35 : countryCode === 'GB' ? 0.85 : 1
  
  return retailers.slice(0, 3 + Math.floor(Math.random() * 3)).map(retailer => ({
    retailer_name: retailer,
    price: Math.round((basePrice * currencyMultiplier * (0.8 + Math.random() * 0.4)) * 100) / 100,
    currency,
    product_url: `https://${retailer.toLowerCase().replace(/[^a-z]/g, '')}.com/product-${Math.random().toString(36).substr(2, 9)}`,
    availability: Math.random() > 0.1 ? 'in_stock' : Math.random() > 0.5 ? 'limited_stock' : 'out_of_stock'
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

    // Log scheduler run start
    const { data: schedulerRun } = await supabase
      .from('scheduler_runs')
      .insert({
        run_type: 'daily',
        status: 'running'
      })
      .select('id')
      .single()

    const runId = schedulerRun?.id
    const startTime = Date.now()

    console.log('🚀 Enhanced product discovery started...')

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

    let totalProductsProcessed = 0
    let newProductsAdded = 0
    let totalPricesUpdated = 0
    let tasksCompleted = 0
    let tasksFailed = 0

    // Create retailer lookup map
    const retailerMap = new Map(retailers.map(r => [r.name, r.id]))

    // Process each category
    for (const category of categories) {
      console.log(`\n📱 Discovering products for: ${category.name}`)
      
      try {
        for (const country of countries) {
          console.log(`  🌍 Processing ${country.name}...`)

          // Discover products for this category and country
          const discoveredProducts = await discoverProductsWithAI(category.slug, country.code, 10)
          
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
                    source: 'enhanced_discovery',
                    category_id: category.id,
                    country_code: country.code,
                    initial_price: discoveredProduct.retailer_prices[0]?.price || 0,
                    initial_retailer_id: retailerMap.get(discoveredProduct.retailer_prices[0]?.retailer_name || ''),
                    metadata: {
                      discovery_method: 'ai_categorization',
                      search_terms: [category.slug],
                      retailer_count: discoveredProduct.retailer_prices.length
                    }
                  })

                console.log(`    ✨ Added: ${discoveredProduct.name}`)
              }

              // Process retailer prices
              for (const priceData of discoveredProduct.retailer_prices) {
                const retailerId = retailerMap.get(priceData.retailer_name)
                if (!retailerId) continue

                // Archive current price to history
                const { data: currentPrice } = await supabase
                  .from('prices')
                  .select('price, currency')
                  .eq('product_id', productId)
                  .eq('retailer_id', retailerId)
                  .single()

                if (currentPrice) {
                  await supabase
                    .from('price_history')
                    .insert({
                      product_id: productId,
                      retailer_id: retailerId,
                      price: currentPrice.price,
                      currency: currentPrice.currency || 'USD'
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

              totalProductsProcessed++
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

    // Update scheduler run status
    const executionTimeMinutes = (Date.now() - startTime) / 1000 / 60
    
    if (runId) {
      await supabase
        .from('scheduler_runs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          execution_time_minutes: Math.round(executionTimeMinutes * 10) / 10,
          tasks_completed: tasksCompleted,
          tasks_failed: tasksFailed,
          summary: {
            categories_processed: categories.length,
            countries_processed: countries.length,
            products_processed: totalProductsProcessed,
            new_products_added: newProductsAdded,
            prices_updated: totalPricesUpdated
          }
        })
        .eq('id', runId)
    }

    const summary = {
      message: 'Enhanced product discovery completed successfully',
      execution_time_minutes: Math.round(executionTimeMinutes * 10) / 10,
      stats: {
        categories_processed: categories.length,
        countries_processed: countries.length,
        products_processed: totalProductsProcessed,
        new_products_added: newProductsAdded,
        prices_updated: totalPricesUpdated,
        tasks_completed: tasksCompleted,
        tasks_failed: tasksFailed
      },
      timestamp: new Date().toISOString()
    }

    console.log('\n🎉 Enhanced Discovery Complete!')
    console.log(`⏱️  Execution time: ${executionTimeMinutes.toFixed(1)} minutes`)
    console.log(`📦 Products processed: ${totalProductsProcessed}`)
    console.log(`✨ New products: ${newProductsAdded}`)
    console.log(`💰 Prices updated: ${totalPricesUpdated}`)

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Critical error in enhanced product discovery:', error)
    
    // Update scheduler run as failed
    if (req.url.includes('scheduler_run_id=')) {
      const runId = new URL(req.url).searchParams.get('scheduler_run_id')
      if (runId) {
        await supabase
          .from('scheduler_runs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_details: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', runId)
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Enhanced product discovery failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})