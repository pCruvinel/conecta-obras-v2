/**
 * This file should be auto-generated to provide type safety for your database schema.
 * 
 * To generate the types, run the following command in your terminal:
 * npx supabase gen types typescript --project-id wrflfxtppmkwybfpzpjg > src/types/supabase.ts
 * 
 * You will need to be logged in to Supabase CLI:
 * npx supabase login
 * 
 * Alternatively, if you are running Supabase locally:
 * npx supabase gen types typescript --local > src/types/supabase.ts
 */

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
      [key: string]: any
    }
    Views: {
      [key: string]: any
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
  }
}
