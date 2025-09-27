import type { User } from "@supabase/supabase-js";

export type Theme = "light" | "dark";

export interface ThemeContextType {
   theme: Theme;
   toggleTheme: () => void;
   setTheme: (theme: Theme) => void;
}

export interface PasswordGeneratorOptions {
   length: number;
   includeUppercase: boolean;
   includeLowercase: boolean;
   includeNumbers: boolean;
   includeSymbols: boolean;
   ensureEachType?: boolean;
}

export interface AuthContextType {
   user: User | null;
   signIn: (email: string, password: string) => Promise<void>;
   signUp: (email: string, password: string) => Promise<void>;
   signInWithGoogle: () => Promise<void>;
   signOut: () => Promise<void>;
   loading: boolean;
}

export interface VaultEntry {
   id: string;
   user_id: string;
   title: string;
   username?: string;
   url?: string;
   category: VaultCategory;
   encrypted_password: string;
   salt: string;
   iv: string;
   created_at: string;
   updated_at: string;
}

export type VaultCategory = "Social Media" | "Email" | "Work" | "Banking" | "Shopping" | "Entertainment" | "Utilities" | "Other";

export interface CreateVaultEntryData {
   title: string;
   username?: string;
   url?: string;
   category: VaultCategory;
   password: string;
}

export interface DashboardStats {
   totalPasswords: number;
   recentActivity: number;
   categoriesCount: Record<VaultCategory, number>;
}
