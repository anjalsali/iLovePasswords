import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey ? "Present" : "Missing");

if (!supabaseUrl || !supabaseAnonKey) {
   console.error("Missing Supabase environment variables:");
   console.error("VITE_SUPABASE_URL:", supabaseUrl);
   console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing");
   throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
   public: {
      Tables: {
         vault_entries: {
            Row: {
               id: string;
               user_id: string;
               title: string;
               username?: string;
               url?: string;
               encrypted_password: string;
               salt: string;
               iv: string;
               created_at: string;
               updated_at: string;
            };
            Insert: {
               id?: string;
               user_id: string;
               title: string;
               username?: string;
               url?: string;
               encrypted_password: string;
               salt: string;
               iv: string;
               created_at?: string;
               updated_at?: string;
            };
            Update: {
               id?: string;
               user_id?: string;
               title?: string;
               username?: string;
               url?: string;
               encrypted_password?: string;
               salt?: string;
               iv?: string;
               created_at?: string;
               updated_at?: string;
            };
         };
      };
      Views: {
         [_ in never]: never;
      };
      Functions: {
         [_ in never]: never;
      };
      Enums: {
         [_ in never]: never;
      };
   };
};
