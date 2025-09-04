import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface HistoricalPriceData {
  product_id: string
  retailer_id: string
  historical_prices: Array<{
    price: number
    date: string
    availability: string
  }>
}

// Simulates fetching historical price data (like wayback machine for prices)
const fetchHistoricalPrices = async (productId: string, retailerId: string, daysBack: number = 365): Promise<HistoricalPriceData> => {
  // In production, this would query archived price data from various sources
  // For simulation, we'll generate realistic historical price patterns
  
  const historical_prices = []
  const basePrice = 299 + Math.random() * 1000 // Random base price
  
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Simulate realistic price fluctuations with seasonal trends
    const seasonalFactor = 1 + 0.1 * Math.sin((date.getMonth() / 12) * 2 * Math.PI) // Seasonal variation
    const randomFactor = 0.95 + Math.random() * 0.1 // ±5% daily variation
    const trendFactor = 1 - (i / daysBack) * 0.15 // Gradual price decrease over time
    
    const price = basePrice * seasonalFactor * randomFactor * trendFactor
    
    historical_prices.push({
      price: Math.round(price * 100) / 100,
      date: date.toISOString().split('T')[0],
      availability: Math.random() > 0.05 ? 'in_stock' : 'out_of_stock'
    })
  }
  
  return {
    product_id: productId,
    retailer_id: retailerId,
    historical_prices
  }
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

    console.log('🕰️ Starting wayback price tracker - backfilling historical data...')

    // Get all products that need historical data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        prices(
          retailer_id,
          retailer:retailers(name, is_active)
        )
      `)
      .limit(50) // Process in batches to avoid timeouts

    if (productsError) throw productsError

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No products found for historical tracking' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`📦 Backfilling historical data for ${products.length} products...`)

    let totalHistoricalRecords = 0

    for (const product of products) {
      if (!product.prices || product.prices.length === 0) continue

      console.log(`📈 Processing historical data for: ${product.name}`)

      for (const price of product.prices) {
        if (!price.retailer?.is_active) continue

        try {
          // Check if we already have historical data for this product-retailer combination
          const { data: existingHistory, error: historyCheckError } = await supabase
            .from('price_history')
            .select('id')
            .eq('product_id', product.id)
            .eq('retailer_id', price.retailer_id)
            .limit(1)

          if (historyCheckError) {
            console.error(`❌ Error checking existing history:`, historyCheckError.message)
            continue
          }

          // Skip if we already have historical data
          if (existingHistory && existingHistory.length > 0) {
            console.log(`    ⏭️  Skipping ${price.retailer.name} - historical data exists`)
            continue
          }

          // Fetch historical price data
          const historicalData = await fetchHistoricalPrices(product.id, price.retailer_id, 365)
          
          // Insert historical price records in batches
          const batchSize = 50
          for (let i = 0; i < historicalData.historical_prices.length; i += batchSize) {
            const batch = historicalData.historical_prices.slice(i, i + batchSize)
            
            const historyRecords = batch.map(record => ({
              product_id: product.id,
              retailer_id: price.retailer_id,
              price: record.price,
              currency: 'USD', // Default currency
              recorded_at: new Date(record.date).toISOString()
            }))

            const { error: insertError } = await supabase
              .from('price_history')
              .insert(historyRecords)

            if (insertError) {
              console.error(`❌ Error inserting historical batch:`, insertError.message)
            } else {
              totalHistoricalRecords += historyRecords.length
            }
          }

          console.log(`    ✅ Added ${historicalData.historical_prices.length} historical records for ${price.retailer.name}`)

        } catch (error) {
          console.error(`❌ Error processing ${price.retailer.name}:`, error)
        }
      }
    }

    // Update deal rankings based on new historical data
    console.log('\n🏆 Updating deal rankings with historical context...')
    
    // Trigger global deals update to recalculate with new historical data
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
      console.log('✅ Deal rankings updated with historical context')
    }

    const summary = {
      message: 'Wayback price tracking completed successfully',
      stats: {
        products_processed: products.length,
        historical_records_added: totalHistoricalRecords,
        average_records_per_product: Math.round(totalHistoricalRecords / products.length),
        timestamp: new Date().toISOString()
      }
    }

    console.log('\n📊 Wayback Tracking Summary:')
    console.log(`   📦 Products processed: ${products.length}`)
    console.log(`   📈 Historical records added: ${totalHistoricalRecords}`)
    console.log(`   📊 Average records per product: ${Math.round(totalHistoricalRecords / products.length)}`)

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error in wayback price tracker:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to complete wayback price tracking',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})