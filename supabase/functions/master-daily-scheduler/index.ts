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
  critical: boolean
}

const DAILY_TASKS: SchedulerTask[] = [
  {
    name: 'Product Discovery',
    function_name: 'daily-product-discovery',
    priority: 1,
    description: 'Discover new products across all categories and countries',
    critical: true
  },
  {
    name: 'Wayback Price Tracking',
    function_name: 'wayback-price-tracker',
    priority: 2,
    description: 'Generate 5-year historical price data for comprehensive analysis',
    critical: true
  },
  {
    name: 'Enhanced Product Discovery',
    function_name: 'enhanced-product-discovery',
    priority: 3,
    description: 'AI-powered product categorization and discovery',
    critical: false
  },
  {
    name: 'Daily Deals Update',
    function_name: 'daily-deals-update',
    priority: 4,
    description: 'Update current prices and detect new deals',
    critical: true
  },
  {
    name: 'Featured Deals Refresh',
    function_name: 'update-featured-deals',
    priority: 5,
    description: 'Refresh featured deals ranking based on latest data',
    critical: true
  },
  {
    name: 'Global Deals Update',
    function_name: 'global-deals-update',
    priority: 6,
    description: 'Update deals across all countries and currencies',
    critical: false
  }
]

const executeTask = async (task: SchedulerTask, supabaseUrl: string, serviceKey: string): Promise<any> => {
  console.log(`⚡ Starting task: ${task.name}`)
  
  const response = await fetch(`${supabaseUrl}/functions/v1/${task.function_name}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Task ${task.name} failed: ${response.status} ${response.statusText} - ${errorText}`)
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

    console.log('🚀 Starting master daily scheduler for comprehensive data update...')

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
      // Execute critical tasks first, then optional ones
      const criticalTasks = DAILY_TASKS.filter(t => t.critical).sort((a, b) => a.priority - b.priority)
      const optionalTasks = DAILY_TASKS.filter(t => !t.critical).sort((a, b) => a.priority - b.priority)

      console.log(`📋 Executing ${criticalTasks.length} critical tasks and ${optionalTasks.length} optional tasks`)

      // Execute critical tasks (must succeed)
      for (const task of criticalTasks) {
        console.log(`🔥 Critical Task: ${task.name}`)
        
        try {
          const taskStartTime = Date.now()
          const result = await executeTask(task, supabaseUrl, serviceKey)
          const taskDuration = (Date.now() - taskStartTime) / 1000

          taskResults.push({
            task: task.name,
            status: 'completed',
            duration_seconds: Math.round(taskDuration * 10) / 10,
            critical: true,
            result: result
          })

          tasksCompleted++
          console.log(`✅ ${task.name} completed in ${taskDuration.toFixed(1)}s`)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          
          taskResults.push({
            task: task.name,
            status: 'failed',
            critical: true,
            error: errorMessage
          })

          tasksFailed++
          console.error(`❌ CRITICAL TASK FAILED - ${task.name}:`, errorMessage)
          
          // For critical tasks, we continue but log the failure
        }

        // Delay between critical tasks
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // Execute optional tasks (failures are acceptable)
      for (const task of optionalTasks) {
        console.log(`⚡ Optional Task: ${task.name}`)
        
        try {
          const taskStartTime = Date.now()
          const result = await executeTask(task, supabaseUrl, serviceKey)
          const taskDuration = (Date.now() - taskStartTime) / 1000

          taskResults.push({
            task: task.name,
            status: 'completed',
            duration_seconds: Math.round(taskDuration * 10) / 10,
            critical: false,
            result: result
          })

          tasksCompleted++
          console.log(`✅ ${task.name} completed in ${taskDuration.toFixed(1)}s`)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          
          taskResults.push({
            task: task.name,
            status: 'failed',
            critical: false,
            error: errorMessage
          })

          tasksFailed++
          console.error(`⚠️ Optional task failed - ${task.name}:`, errorMessage)
        }

        // Shorter delay between optional tasks
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const totalDuration = (Date.now() - startTime) / 1000 / 60 // Convert to minutes
      const criticalTasksSuccess = taskResults.filter(t => t.critical && t.status === 'completed').length
      const criticalTasksTotal = criticalTasks.length
      const overallSuccess = criticalTasksSuccess === criticalTasksTotal

      const finalStatus = overallSuccess 
        ? (tasksFailed === 0 ? 'completed' : 'completed_with_errors')
        : 'failed'

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
            critical_tasks_success: criticalTasksSuccess,
            critical_tasks_total: criticalTasksTotal,
            overall_success: overallSuccess,
            task_results: taskResults,
            execution_summary: {
              total_duration_minutes: Math.round(totalDuration * 100) / 100,
              success_rate: Math.round((tasksCompleted / DAILY_TASKS.length) * 100),
              critical_success_rate: Math.round((criticalTasksSuccess / criticalTasksTotal) * 100)
            }
          }
        })
        .eq('id', runId)

      const summary = {
        run_id: runId,
        status: finalStatus,
        total_tasks: DAILY_TASKS.length,
        critical_tasks_success: criticalTasksSuccess,
        critical_tasks_total: criticalTasksTotal,
        tasks_completed: tasksCompleted,
        tasks_failed: tasksFailed,
        execution_time_minutes: Math.round(totalDuration * 100) / 100,
        success_rate: Math.round((tasksCompleted / DAILY_TASKS.length) * 100),
        critical_success_rate: Math.round((criticalTasksSuccess / criticalTasksTotal) * 100),
        overall_success: overallSuccess,
        task_results: taskResults
      }

      console.log('\n🎉 Master daily scheduler completed!')
      console.log(`⏱️  Total execution time: ${totalDuration.toFixed(1)} minutes`)
      console.log(`✅ Critical tasks: ${criticalTasksSuccess}/${criticalTasksTotal}`)
      console.log(`📊 Overall success rate: ${summary.success_rate}%`)

      return new Response(
        JSON.stringify({
          success: overallSuccess,
          message: overallSuccess 
            ? 'Daily scheduler completed successfully' 
            : 'Daily scheduler completed with critical failures',
          summary
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: overallSuccess ? 200 : 206 // 206 = Partial Content for partial success
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