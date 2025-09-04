import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface SchedulerTask {
  name: string
  function_name: string
  priority: number
  description: string
}

const DAILY_TASKS: SchedulerTask[] = [
  {
    name: 'Product Discovery',
    function_name: 'daily-product-discovery',
    priority: 1,
    description: 'Discover new products across all categories and countries'
  },
  {
    name: 'Wayback Price Tracking',
    function_name: 'wayback-price-tracker',
    priority: 2,
    description: 'Generate historical price data for new products'
  },
  {
    name: 'Daily Deals Update',
    function_name: 'daily-deals-update',
    priority: 3,
    description: 'Update current prices and detect new deals'
  },
  {
    name: 'Featured Deals Refresh',
    function_name: 'update-featured-deals',
    priority: 4,
    description: 'Refresh featured deals ranking based on latest data'
  },
  {
    name: 'Global Deals Update',
    function_name: 'global-deals-update',
    priority: 5,
    description: 'Update deals across all countries and currencies'
  }
]

const executeTask = async (task: SchedulerTask, supabaseUrl: string, serviceKey: string): Promise<any> => {
  const response = await fetch(`${supabaseUrl}/functions/v1/${task.function_name}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Task ${task.name} failed: ${response.status} ${response.statusText}`)
  }

  return await response.json()
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    console.log('🚀 Starting master daily scheduler...')

    // Create scheduler run record
    const { data: schedulerRun, error: runError } = await supabase
      .from('scheduler_runs')
      .insert({
        run_type: 'daily_full_update',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (runError) throw runError

    const runId = schedulerRun.id
    const startTime = Date.now()
    let tasksCompleted = 0
    let tasksFailed = 0
    const taskResults: any[] = []

    try {
      // Execute tasks in priority order
      for (const task of DAILY_TASKS.sort((a, b) => a.priority - b.priority)) {
        console.log(`⚡ Executing: ${task.name}`)
        
        try {
          const taskStartTime = Date.now()
          const result = await executeTask(task, supabaseUrl, serviceKey)
          const taskDuration = (Date.now() - taskStartTime) / 1000

          taskResults.push({
            task: task.name,
            status: 'completed',
            duration_seconds: taskDuration,
            result: result
          })

          tasksCompleted++
          console.log(`✅ ${task.name} completed in ${taskDuration}s`)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          
          taskResults.push({
            task: task.name,
            status: 'failed',
            error: errorMessage
          })

          tasksFailed++
          console.error(`❌ ${task.name} failed:`, errorMessage)
        }

        // Small delay between tasks to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const totalDuration = (Date.now() - startTime) / 1000 / 60 // Convert to minutes
      const finalStatus = tasksFailed === 0 ? 'completed' : 'completed_with_errors'

      // Update scheduler run with completion status
      await supabase
        .from('scheduler_runs')
        .update({
          status: finalStatus,
          completed_at: new Date().toISOString(),
          execution_time_minutes: Math.round(totalDuration * 100) / 100,
          tasks_completed: tasksCompleted,
          tasks_failed: tasksFailed,
          summary: {
            total_tasks: DAILY_TASKS.length,
            task_results: taskResults,
            execution_summary: {
              total_duration_minutes: Math.round(totalDuration * 100) / 100,
              success_rate: Math.round((tasksCompleted / DAILY_TASKS.length) * 100)
            }
          }
        })
        .eq('id', runId)

      const summary = {
        run_id: runId,
        status: finalStatus,
        total_tasks: DAILY_TASKS.length,
        tasks_completed: tasksCompleted,
        tasks_failed: tasksFailed,
        execution_time_minutes: Math.round(totalDuration * 100) / 100,
        success_rate: Math.round((tasksCompleted / DAILY_TASKS.length) * 100),
        task_results: taskResults
      }

      console.log('🎉 Master daily scheduler completed:', summary)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Daily scheduler completed successfully',
          summary
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )

    } catch (error) {
      // Update scheduler run with error status
      await supabase
        .from('scheduler_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          execution_time_minutes: Math.round((Date.now() - startTime) / 1000 / 60 * 100) / 100,
          tasks_completed: tasksCompleted,
          tasks_failed: tasksFailed + 1,
          error_details: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', runId)

      throw error
    }

  } catch (error) {
    console.error('❌ Master daily scheduler failed:', error)
    
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