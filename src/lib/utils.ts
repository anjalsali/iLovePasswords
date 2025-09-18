import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generatePassword(length: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean): string {
   let charset = "";

   if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
   if (includeNumbers) charset += "0123456789";
   if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

   if (charset === "") return "";

   let password = "";
   for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
   }

   return password;
}

export function calculatePasswordStrength(password: string): {
   score: number;
   label: string;
   color: string;
} {
   if (password.length === 0) return { score: 0, label: "No password", color: "bg-gray-300" };

   let score = 0;

   // Length
   if (password.length >= 8) score += 1;
   if (password.length >= 12) score += 1;
   if (password.length >= 16) score += 1;

   // Character types
   if (/[a-z]/.test(password)) score += 1;
   if (/[A-Z]/.test(password)) score += 1;
   if (/[0-9]/.test(password)) score += 1;
   if (/[^A-Za-z0-9]/.test(password)) score += 1;

   // Patterns
   if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
   if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) score += 1; // No sequences

   if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
   if (score <= 4) return { score, label: "Fair", color: "bg-orange-500" };
   if (score <= 6) return { score, label: "Good", color: "bg-yellow-500" };
   if (score <= 8) return { score, label: "Strong", color: "bg-green-500" };
   return { score, label: "Very Strong", color: "bg-emerald-500" };
}

export async function copyToClipboard(text: string): Promise<boolean> {
   try {
      await navigator.clipboard.writeText(text);
      return true;
   } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
   }
}
