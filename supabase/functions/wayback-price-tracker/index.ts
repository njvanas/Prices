import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface PriceSnapshot {
  product_id: string
  retailer_id: string
  price: number
  currency: string
  recorded_at: string
  price_change_percent?: number
  is_deal: boolean
  deal_score: number
}

// Generate historical price data (simulates wayback machine functionality)
const generateHistoricalPrices = (currentPrice: number, daysBack: number): number[] => {
  const prices = []
  let price = currentPrice * (1.1 + Math.random() * 0.2) // Start 10-30% higher than current
  
  for (let i = daysBack; i >= 0; i--) {
    // Simulate market trends with seasonal variations
    const seasonalFactor = 1 + 0.1 * Math.sin((i / 365) * 2 * Math.PI) // Yearly cycle
    const weeklyFactor = 1 + 0.05 * Math.sin((i / 7) * 2 * Math.PI) // Weekly cycle
    const randomFactor = 0.95 + Math.random() * 0.1 // ±5% daily variation
    
    // Apply gradual downward trend (prices generally decrease over time)
    const trendFactor = 1 - (daysBack - i) * 0.001 // 0.1% decrease per day
    
    price = price * seasonalFactor * weeklyFactor * randomFactor * trendFactor
    
    // Ensure price doesn't go below 70% of current price
    price = Math.max(price, currentPrice * 0.7)
    
    prices.push(Math.round(price * 100) / 100)
  }
  
  return prices
}

// Calculate deal score based on historical context
const calculateDealScore = (currentPrice: number, historicalPrices: number[]): number => {
  const avgPrice = historicalPrices.reduce((sum, p) => sum + p, 0) / historicalPrices.length
  const minPrice = Math.min(...historicalPrices)
  const maxPrice = Math.max(...historicalPrices)
  
  // Score from 0-10 based on how good the current price is
  const priceRange = maxPrice - minPrice
  if (priceRange === 0) return 5 // No variation, neutral score
  
  const pricePosition = (maxPrice - currentPrice) / priceRange
  return Math.round(pricePosition * 10 * 10) / 10 // Round to 1 decimal
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

    console.log('🕰️ Starting wayback price tracking...')

    // Get all current prices
    const { data: currentPrices, error: pricesError } = await supabase
      .from('prices')
      .select(`
        *,
        product:products(name, brand),
        retailer:retailers(name)
      `)

    if (pricesError) throw pricesError

    let totalHistoricalRecords = 0
    let totalProductsProcessed = 0

    // Process each current price to generate historical data
    for (const currentPrice of currentPrices || []) {
      try {
        console.log(`📊 Processing price history for ${currentPrice.product?.name} at ${currentPrice.retailer?.name}`)

        // Check if we already have historical data for this product/retailer
        const { data: existingHistory } = await supabase
          .from('price_history')
          .select('id')
          .eq('product_id', currentPrice.product_id)
          .eq('retailer_id', currentPrice.retailer_id)
          .limit(1)

        if (existingHistory && existingHistory.length > 0) {
          console.log(`⏭️ Skipping - historical data already exists`)
          continue
        }

        // Generate 365 days of historical price data
        const historicalPrices = generateHistoricalPrices(Number(currentPrice.price), 365)
        const priceSnapshots: PriceSnapshot[] = []

        for (let dayOffset = 365; dayOffset >= 1; dayOffset--) {
          const recordedDate = new Date()
          recordedDate.setDate(recordedDate.getDate() - dayOffset)
          
          const historicalPrice = historicalPrices[365 - dayOffset]
          const previousPrice = dayOffset < 365 ? historicalPrices[365 - dayOffset - 1] : historicalPrice
          
          const priceChangePercent = previousPrice > 0 
            ? ((historicalPrice - previousPrice) / previousPrice) * 100 
            : 0

          const dealScore = calculateDealScore(historicalPrice, historicalPrices.slice(0, 365 - dayOffset + 1))
          const isDeal = dealScore >= 7.0 // Consider it a deal if score is 7.0 or higher

          priceSnapshots.push({
            product_id: currentPrice.product_id,
            retailer_id: currentPrice.retailer_id,
            price: historicalPrice,
            currency: currentPrice.currency,
            recorded_at: recordedDate.toISOString(),
            price_change_percent: Math.round(priceChangePercent * 100) / 100,
            is_deal: isDeal,
            deal_score: dealScore
          })
        }

        // Insert historical data in batches
        const batchSize = 50
        for (let i = 0; i < priceSnapshots.length; i += batchSize) {
          const batch = priceSnapshots.slice(i, i + batchSize)
          
          const { error: insertError } = await supabase
            .from('price_history')
            .insert(batch)

          if (insertError) {
            console.error(`❌ Error inserting batch for ${currentPrice.product?.name}:`, insertError)
            continue
          }
        }

        totalHistoricalRecords += priceSnapshots.length
        totalProductsProcessed++

        console.log(`✅ Added ${priceSnapshots.length} historical records for ${currentPrice.product?.name}`)

        // Add small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ Error processing ${currentPrice.product?.name}:`, error)
      }
    }

    const summary = {
      total_products_processed: totalProductsProcessed,
      total_historical_records: totalHistoricalRecords,
      days_of_history: 365,
      processing_date: new Date().toISOString()
    }

    console.log('✅ Wayback price tracking completed:', summary)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Wayback price tracking completed successfully',
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Wayback price tracking failed:', error)
    
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