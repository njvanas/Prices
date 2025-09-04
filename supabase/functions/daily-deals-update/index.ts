import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface ProductWithPrices {
  id: string
  name: string
  brand: string
  model: string
  image_url: string
  category_id: string
  prices: Array<{
    id: string
    price: number
    currency: string
    availability: string
    retailer: {
      name: string
      logo_url: string
      is_active: boolean
    }
  }>
}

interface FeaturedDeal {
  product_id: string
  savings_amount: number
  savings_percentage: number
  lowest_price: number
  highest_price: number
  deal_rank: number
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔄 Starting daily featured deals update...')

    // Fetch all products with their prices and retailers
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        brand,
        model,
        image_url,
        category_id,
        prices (
          id,
          price,
          currency,
          availability,
          retailer:retailers (
            name,
            logo_url,
            is_active
          )
        )
      `)
      .eq('prices.retailer.is_active', true)

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`)
    }

    if (!products || products.length === 0) {
      console.log('⚠️ No products found')
      return new Response(
        JSON.stringify({ message: 'No products found', updated: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`📦 Analyzing ${products.length} products for best deals...`)

    // Calculate savings for each product
    const dealsAnalysis: FeaturedDeal[] = []

    for (const product of products as ProductWithPrices[]) {
      if (!product.prices || product.prices.length < 2) {
        continue // Need at least 2 prices to compare
      }

      // Filter active retailer prices that are in stock
      const activePrices = product.prices.filter(p => 
        p.retailer?.is_active && 
        p.availability === 'in_stock' &&
        p.price > 0
      )
      
      if (activePrices.length < 2) continue

      const prices = activePrices.map(p => p.price)
      const lowestPrice = Math.min(...prices)
      const highestPrice = Math.max(...prices)
      
      // Only consider deals with meaningful savings
      if (lowestPrice >= highestPrice || lowestPrice <= 0) continue

      const savingsAmount = highestPrice - lowestPrice
      const savingsPercentage = (savingsAmount / highestPrice) * 100

      // Only include deals with at least 30% savings for featured deals
      if (savingsPercentage >= 30) {
        dealsAnalysis.push({
          product_id: product.id,
          savings_amount: savingsAmount,
          savings_percentage: savingsPercentage,
          lowest_price: lowestPrice,
          highest_price: highestPrice,
          deal_rank: 0 // Will be set after sorting
        })
      }
    }

    // Sort by savings percentage (highest first), then by savings amount
    dealsAnalysis.sort((a, b) => {
      if (Math.abs(a.savings_percentage - b.savings_percentage) < 1) {
        return b.savings_amount - a.savings_amount
      }
      return b.savings_percentage - a.savings_percentage
    })

    // Take top 10 and assign ranks
    const top10Deals = dealsAnalysis.slice(0, 10).map((deal, index) => ({
      ...deal,
      deal_rank: index + 1
    }))

    console.log(`🏆 Found ${top10Deals.length} featured deals (30%+ savings)`)

    if (top10Deals.length === 0) {
      console.log('📊 No deals with 30%+ savings found')
      return new Response(
        JSON.stringify({ message: 'No significant deals found (30%+ savings)', updated: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Clear existing featured deals
    const { error: deleteError } = await supabase
      .from('featured_deals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('❌ Error clearing old deals:', deleteError)
    } else {
      console.log('🗑️ Cleared old featured deals')
    }

    // Insert new featured deals
    const { error: insertError } = await supabase
      .from('featured_deals')
      .insert(top10Deals)

    if (insertError) {
      throw new Error(`Failed to insert featured deals: ${insertError.message}`)
    }

    console.log('✅ Featured deals updated successfully!')

    // Log the top deals for monitoring
    for (const deal of top10Deals) {
      console.log(`🎯 Rank ${deal.deal_rank}: ${deal.savings_percentage.toFixed(1)}% off (Save $${deal.savings_amount.toFixed(2)})`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Featured deals updated successfully',
        updated: top10Deals.length,
        deals: top10Deals.map(d => ({
          rank: d.deal_rank,
          savings_percentage: Math.round(d.savings_percentage),
          savings_amount: Math.round(d.savings_amount)
        })),
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error updating featured deals:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update featured deals',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})