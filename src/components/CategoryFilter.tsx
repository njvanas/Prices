import React from 'react'
import type { Database } from '../lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-primary-100 text-primary-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}