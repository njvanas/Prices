import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Loading amazing deals...</p>
      </div>
    </div>
  )
}

export { LoadingSpinner }