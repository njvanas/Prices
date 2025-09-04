import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface ScheduledTask {
  name: string
  function_name: string
  description: string
  priority: number
  estimated_duration_minutes: number
}

const DAILY_TASKS: ScheduledTask[] = [
  {
    name: 'Product Discovery',
    function_name: 'daily-product-discovery',
    description: 'Discover new products across all categories and countries',
    priority: 1,
    estimated_duration_minutes: 15
  },
  {
    name: 'Wayback Price Tracking',
    function_name: 'wayback-price-tracker',
    description: 'Backfill historical price data for comprehensive tracking',
    priority: 2,
    estimated_duration_minutes: 10
  },
  {
    name: 'Global Deals Update',
    function_name: 'global-deals-update',
    description: 'Calculate and rank featured deals across all countries',
    priority: 3,
    estimated_duration_minutes: 5
  }
]

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

    console.log('🚀 Starting master daily scheduler...')
    console.log(`📅 Execution time: ${new Date().toISOString()}`)

    const results = []
    let totalExecutionTime = 0

    // Execute tasks in priority order
    for (const task of DAILY_TASKS.sort((a, b) => a.priority - b.priority)) {
      console.log(`\n⏰ Executing: ${task.name}`)
      console.log(`📝 Description: ${task.description}`)
      console.log(`⏱️  Estimated duration: ${task.estimated_duration_minutes} minutes`)

      const startTime = Date.now()

      try {
        const functionUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/${task.function_name}`
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        })

        const executionTime = (Date.now() - startTime) / 1000 / 60 // Convert to minutes
        totalExecutionTime += executionTime

        if (response.ok) {
          const result = await response.json()
          console.log(`✅ ${task.name} completed successfully in ${executionTime.toFixed(1)} minutes`)
          
          results.push({
            task: task.name,
            status: 'success',
            execution_time_minutes: Math.round(executionTime * 10) / 10,
            result: result
          })
        } else {
          const errorText = await response.text()
          console.error(`❌ ${task.name} failed: ${response.status} ${response.statusText}`)
          console.error(`Error details: ${errorText}`)
          
          results.push({
            task: task.name,
            status: 'failed',
            execution_time_minutes: Math.round(executionTime * 10) / 10,
            error: `${response.status}: ${errorText}`
          })
        }

      } catch (error) {
        const executionTime = (Date.now() - startTime) / 1000 / 60
        totalExecutionTime += executionTime
        
        console.error(`❌ ${task.name} failed with exception:`, error)
        
        results.push({
          task: task.name,
          status: 'failed',
          execution_time_minutes: Math.round(executionTime * 10) / 10,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Log execution summary
    console.log('\n📊 Daily Scheduler Summary:')
    console.log(`⏱️  Total execution time: ${totalExecutionTime.toFixed(1)} minutes`)
    console.log(`✅ Successful tasks: ${results.filter(r => r.status === 'success').length}`)
    console.log(`❌ Failed tasks: ${results.filter(r => r.status === 'failed').length}`)

    // Log individual task results
    results.forEach(result => {
      const icon = result.status === 'success' ? '✅' : '❌'
      console.log(`${icon} ${result.task}: ${result.execution_time_minutes}min`)
    })

    const summary = {
      message: 'Daily scheduler execution completed',
      execution_summary: {
        total_tasks: DAILY_TASKS.length,
        successful_tasks: results.filter(r => r.status === 'success').length,
        failed_tasks: results.filter(r => r.status === 'failed').length,
        total_execution_time_minutes: Math.round(totalExecutionTime * 10) / 10,
        timestamp: new Date().toISOString()
      },
      task_results: results
    }

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Critical error in master scheduler:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Master scheduler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})