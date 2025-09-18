export interface VaultEntry {
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
}

export interface DecryptedVaultEntry extends Omit<VaultEntry, "encrypted_password"> {
   password: string;
}

export interface PasswordGeneratorOptions {
   length: number;
   includeUppercase: boolean;
   includeLowercase: boolean;
   includeNumbers: boolean;
   includeSymbols: boolean;
}

export interface AuthContextType {
   user: any | null;
   signIn: (email: string, password: string) => Promise<void>;
   signUp: (email: string, password: string) => Promise<void>;
   signOut: () => Promise<void>;
   loading: boolean;
}
