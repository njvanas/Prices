import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Database, TrendingUp } from 'lucide-react'
import { PriceComparisonAPI } from '../lib/api'

interface SchedulerRun {
  id: string
  run_type: string
  status: string
  started_at: string
  completed_at?: string
  execution_time_minutes?: number
  tasks_completed?: number
  tasks_failed?: number
  error_details?: string
  summary?: {
    total_tasks: number
    critical_tasks_success: number
    critical_tasks_total: number
    success_rate: number
    critical_success_rate: number
    overall_success: boolean
    task_results: Array<{
      task: string
      status: string
      critical: boolean
      duration_seconds?: number
      error?: string
      result?: any
    }>
  }
}

export function SchedulerStatus() {
  const [schedulerRuns, setSchedulerRuns] = useState<SchedulerRun[]>([])
  const [loading, setLoading] = useState(true)

  const loadSchedulerStatus = async () => {
    try {
      const runs = await PriceComparisonAPI.getSchedulerStatus()
      setSchedulerRuns(runs)
    } catch (error) {
      console.error('Failed to load scheduler status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedulerStatus()
    // Refresh every 30 seconds to show real-time updates
    const interval = setInterval(loadSchedulerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 text-warning-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-400" />
      case 'completed_with_errors':
        return <AlertCircle className="w-4 h-4 text-warning-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-error-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-warning-300 bg-warning-500/10 border-warning-500/30'
      case 'completed':
        return 'text-success-300 bg-success-500/10 border-success-500/30'
      case 'completed_with_errors':
        return 'text-warning-300 bg-warning-500/10 border-warning-500/30'
      case 'failed':
        return 'text-error-300 bg-error-500/10 border-error-500/30'
      default:
        return 'text-gray-300 bg-gray-500/10 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  const latestRun = schedulerRuns[0]
  const isRunning = latestRun?.status === 'running'

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary-400" />
          System Status
        </h3>
        {isRunning && (
          <div className="flex items-center gap-2 text-warning-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Auto-updating...</span>
          </div>
        )}
      </div>

      {latestRun ? (
        <div className="space-y-4">
          {/* Latest Run Status */}
          <div className={`p-4 rounded-lg border ${getStatusColor(latestRun.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(latestRun.status)}
                <span className="font-medium capitalize">
                  {latestRun.status.replace('_', ' ')}
                </span>
              </div>
              <span className="text-sm opacity-75">
                {new Date(latestRun.started_at).toLocaleString()}
              </span>
            </div>
            
            {latestRun.summary && (
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="opacity-75">Critical Tasks:</span>
                  <span className="ml-2 font-medium">
                    {latestRun.summary.critical_tasks_success || 0}/{latestRun.summary.critical_tasks_total || 0}
                  </span>
                </div>
                <div>
                  <span className="opacity-75">Success Rate:</span>
                  <span className="ml-2 font-medium">
                    {latestRun.summary.critical_success_rate || 0}%
                  </span>
                </div>
                {latestRun.execution_time_minutes && (
                  <div className="col-span-2">
                    <span className="opacity-75">Duration:</span>
                    <span className="ml-2 font-medium">
                      {latestRun.execution_time_minutes} minutes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Data Insights */}
          {latestRun.summary?.task_results && (
            <div className="bg-dark-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Latest Update Results
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {latestRun.summary.task_results
                  .filter(task => task.result && task.status === 'completed')
                  .map((task, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{task.task}</span>
                      <div className="flex items-center gap-2">
                        {task.result?.summary && (
                          <span className="text-success-400">
                            {task.result.summary.new_products_added || task.result.summary.total_deals_updated || 'Updated'}
                          </span>
                        )}
                        <CheckCircle className="w-3 h-3 text-success-400" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* System Health Indicator */}
          <div className="bg-dark-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Freshness</span>
              <div className="flex items-center gap-2">
                {latestRun.completed_at && (
                  <>
                    <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-success-400">
                      Updated {Math.round((Date.now() - new Date(latestRun.completed_at).getTime()) / (1000 * 60 * 60))}h ago
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Runs History */}
          {schedulerRuns.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Recent Updates:</h4>
              <div className="space-y-1">
                {schedulerRuns.slice(1, 4).map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-2 bg-dark-700/20 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <span className="text-sm text-gray-300">
                        {new Date(run.started_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {run.summary?.critical_tasks_success || 0}/{run.summary?.critical_tasks_total || 0} critical
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>System initializing...</p>
          <p className="text-sm mt-1">Automated data collection will begin shortly</p>
        </div>
      )}
    </div>
  )
}