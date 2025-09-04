import type { Database } from '../lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-xl">
      <h3 className="font-semibold text-white mb-6 text-xl flex items-center">
        <span className="text-2xl mr-3">📱</span>
        Product Categories
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
            selectedCategory === null
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          ⭐ All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}