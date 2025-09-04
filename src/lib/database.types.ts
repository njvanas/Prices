export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string | null
        }
      }
      retailers: {
        Row: {
          id: string
          name: string
          website_url: string
          logo_url: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          website_url: string
          logo_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          website_url?: string
          logo_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          brand: string | null
          model: string | null
          category_id: string | null
          image_url: string | null
          specifications: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          brand?: string | null
          model?: string | null
          category_id?: string | null
          image_url?: string | null
          specifications?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          brand?: string | null
          model?: string | null
          category_id?: string | null
          image_url?: string | null
          specifications?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      prices: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string | null
          product_url: string
          availability: string | null
          last_checked: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string | null
          product_url: string
          availability?: string | null
          last_checked?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string | null
          product_url?: string
          availability?: string | null
          last_checked?: string | null
          created_at?: string | null
        }
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string | null
          recorded_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string | null
          recorded_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string | null
          recorded_at?: string | null
        }
      }
      featured_deals: {
        Row: {
          id: string
          product_id: string
          savings_amount: number
          savings_percentage: number
          lowest_price: number
          highest_price: number
          deal_rank: number
          last_updated: string | null
          expires_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          savings_amount: number
          savings_percentage: number
          lowest_price: number
          highest_price: number
          deal_rank: number
          last_updated?: string | null
          expires_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          savings_amount?: number
          savings_percentage?: number
          lowest_price?: number
          highest_price?: number
          deal_rank?: number
          last_updated?: string | null
          expires_at?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}