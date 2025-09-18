import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generatePassword(length: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean, ensureEachType?: boolean): string {
   if (ensureEachType === undefined) ensureEachType = false;
   const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const lowerCharset = "abcdefghijklmnopqrstuvwxyz";
   const numberCharset = "0123456789";
   const symbolCharset = "!@#$%^&*()_+-=[]{}|;:,.<>?";

   let charset = "";
   const requiredChars: string[] = [];

   if (includeUppercase) {
      charset += upperCharset;
      if (ensureEachType) {
         requiredChars.push(upperCharset.charAt(Math.floor(Math.random() * upperCharset.length)));
      }
   }
   if (includeLowercase) {
      charset += lowerCharset;
      if (ensureEachType) {
         requiredChars.push(lowerCharset.charAt(Math.floor(Math.random() * lowerCharset.length)));
      }
   }
   if (includeNumbers) {
      charset += numberCharset;
      if (ensureEachType) {
         requiredChars.push(numberCharset.charAt(Math.floor(Math.random() * numberCharset.length)));
      }
   }
   if (includeSymbols) {
      charset += symbolCharset;
      if (ensureEachType) {
         requiredChars.push(symbolCharset.charAt(Math.floor(Math.random() * symbolCharset.length)));
      }
   }

   if (charset === "") return "";

   let password = "";

   // Add required characters first
   if (ensureEachType && requiredChars.length > 0) {
      // Shuffle required characters and add them
      for (let i = requiredChars.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
      }
      password = requiredChars.join("");
   }

   // Fill remaining length with random characters
   for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
   }

   // Shuffle the final password to avoid predictable patterns
   const passwordArray = password.split("");
   for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
   }

   return passwordArray.join("");
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
