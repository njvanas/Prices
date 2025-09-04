import React from 'react'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-dark-600 border-t-primary-500 shadow-lg"></div>
      <p className="text-gray-400 mt-4 animate-pulse">Finding the best deals...</p>
    </div>
  )
}