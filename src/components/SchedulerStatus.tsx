import React, { useState, useEffect } from 'react'
import { Play, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
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
    success_rate: number
    task_results: Array<{
      task: string
      status: string
      duration_seconds?: number
      error?: string
    }>
  }
}

export function SchedulerStatus() {
  const [schedulerRuns, setSchedulerRuns] = useState<SchedulerRun[]>([])
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)

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

  const triggerUpdate = async () => {
    setTriggering(true)
    try {
      const result = await PriceComparisonAPI.triggerDataUpdate()
      if (result.success) {
        // Refresh status after triggering
        setTimeout(loadSchedulerStatus, 2000)
      }
    } catch (error) {
      console.error('Failed to trigger update:', error)
    } finally {
      setTriggering(false)
    }
  }

  useEffect(() => {
    loadSchedulerStatus()
    // Refresh every 30 seconds
    const interval = setInterval(loadSchedulerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-warning-400 animate-pulse" />
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

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary-400" />
          Data Update Status
        </h3>
        <button
          onClick={triggerUpdate}
          disabled={triggering || latestRun?.status === 'running'}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
        >
          {triggering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Triggering...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Update Now
            </>
          )}
        </button>
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
                  <span className="opacity-75">Tasks:</span>
                  <span className="ml-2 font-medium">
                    {latestRun.tasks_completed || 0}/{latestRun.summary.total_tasks}
                  </span>
                </div>
                <div>
                  <span className="opacity-75">Success Rate:</span>
                  <span className="ml-2 font-medium">
                    {latestRun.summary.success_rate || 0}%
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

          {/* Task Breakdown */}
          {latestRun.summary?.task_results && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Task Details:</h4>
              {latestRun.summary.task_results.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-success-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-error-400" />
                    )}
                    <span className="text-sm text-gray-200">{task.task}</span>
                  </div>
                  {task.duration_seconds && (
                    <span className="text-xs text-gray-400">
                      {task.duration_seconds}s
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recent Runs History */}
          {schedulerRuns.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Recent Runs:</h4>
              <div className="space-y-1">
                {schedulerRuns.slice(1, 6).map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-2 bg-dark-700/20 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <span className="text-sm text-gray-300">
                        {new Date(run.started_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {run.tasks_completed || 0}/{run.summary?.total_tasks || 0} tasks
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No scheduler runs found</p>
          <p className="text-sm mt-1">Click "Update Now" to start data collection</p>
        </div>
      )}
    </div>
  )
}