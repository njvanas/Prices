import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, RefreshCw, Calendar, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface SchedulerRun {
  id: string
  run_type: string
  status: string
  started_at: string
  completed_at: string | null
  execution_time_minutes: number | null
  tasks_completed: number
  tasks_failed: number
  summary: any
}

interface SchedulerStatusProps {
  onTriggerUpdate?: () => void
}

export function SchedulerStatus({ onTriggerUpdate }: SchedulerStatusProps) {
  const [schedulerRuns, setSchedulerRuns] = useState<SchedulerRun[]>([])
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    loadSchedulerStatus()
  }, [])

  const loadSchedulerStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduler_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setSchedulerRuns(data || [])
    } catch (error) {
      console.error('Failed to load scheduler status:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerManualUpdate = async () => {
    try {
      setTriggering(true)
      
      // Trigger the master scheduler
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/master-daily-scheduler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        console.log('✅ Manual update triggered successfully')
        // Refresh status after a delay
        setTimeout(() => {
          loadSchedulerStatus()
          onTriggerUpdate?.()
        }, 2000)
      } else {
        console.error('❌ Failed to trigger manual update')
      }
    } catch (error) {
      console.error('Error triggering manual update:', error)
    } finally {
      setTriggering(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-error-400" />
      case 'running':
        return <RefreshCw className="w-5 h-5 text-primary-400 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-400'
      case 'failed': return 'text-error-400'
      case 'running': return 'text-primary-400'
      default: return 'text-gray-400'
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    if (minutes < 1) return `${Math.round(minutes * 60)}s`
    return `${minutes.toFixed(1)}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <Calendar className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">Data Update Status</h3>
            <p className="text-gray-400 text-sm">Automated daily price tracking and product discovery</p>
          </div>
        </div>
        <button
          onClick={triggerManualUpdate}
          disabled={triggering}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
        >
          <RefreshCw className={`w-4 h-4 ${triggering ? 'animate-spin' : ''}`} />
          <span>{triggering ? 'Updating...' : 'Update Now'}</span>
        </button>
      </div>

      {/* Recent Runs */}
      <div className="space-y-4">
        {schedulerRuns.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No scheduler runs recorded yet</p>
            <p className="text-gray-500 text-sm mt-2">Trigger a manual update to start tracking</p>
          </div>
        ) : (
          schedulerRuns.map((run) => (
            <div
              key={run.id}
              className="bg-dark-800/50 border border-dark-600 rounded-lg p-4 hover:bg-dark-800/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(run.status)}
                  <div>
                    <h4 className={`font-medium ${getStatusColor(run.status)}`}>
                      {run.run_type.charAt(0).toUpperCase() + run.run_type.slice(1)} Update
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {formatDate(run.started_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 font-medium">
                    {formatDuration(run.execution_time_minutes)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {run.tasks_completed}✅ {run.tasks_failed}❌
                  </p>
                </div>
              </div>

              {/* Summary Stats */}
              {run.summary && Object.keys(run.summary).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-dark-600">
                  {Object.entries(run.summary).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-gray-400 text-xs mb-1">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-gray-200 font-semibold">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Error Details */}
              {run.status === 'failed' && run.error_details && (
                <div className="mt-4 p-3 bg-error-500/10 border border-error-500/30 rounded-lg">
                  <p className="text-error-300 text-sm font-medium mb-1">Error Details:</p>
                  <p className="text-error-200 text-xs">{run.error_details}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-6 border-t border-dark-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-dark-800/30 rounded-lg p-4">
            <h4 className="text-gray-300 font-medium mb-2">🔍 Product Discovery</h4>
            <p className="text-gray-400 text-sm">Automatically finds new products across all categories daily</p>
          </div>
          <div className="bg-dark-800/30 rounded-lg p-4">
            <h4 className="text-gray-300 font-medium mb-2">📈 Price Tracking</h4>
            <p className="text-gray-400 text-sm">Maintains 90-day price history like a wayback machine</p>
          </div>
          <div className="bg-dark-800/30 rounded-lg p-4">
            <h4 className="text-gray-300 font-medium mb-2">🏆 Deal Ranking</h4>
            <p className="text-gray-400 text-sm">Updates featured deals based on savings and trends</p>
          </div>
        </div>
      </div>
    </div>
  )
}