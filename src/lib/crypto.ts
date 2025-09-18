// Client-side encryption utilities using Web Crypto API

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Generate a random salt
 */
export function generateSalt(): Uint8Array {
   return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random initialization vector
 */
export function generateIV(): Uint8Array {
   return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Derive a key from a password using PBKDF2
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
   const encoder = new TextEncoder();
   const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

   return crypto.subtle.deriveKey(
      {
         name: "PBKDF2",
         salt,
         iterations: ITERATIONS,
         hash: "SHA-256",
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ["encrypt", "decrypt"]
   );
}

/**
 * Encrypt a password using AES-GCM
 */
export async function encryptPassword(
   password: string,
   masterPassword: string
): Promise<{
   encryptedData: string;
   salt: string;
   iv: string;
}> {
   const encoder = new TextEncoder();
   const salt = generateSalt();
   const iv = generateIV();

   const key = await deriveKey(masterPassword, salt);

   const encryptedBuffer = await crypto.subtle.encrypt(
      {
         name: ALGORITHM,
         iv,
      },
      key,
      encoder.encode(password)
   );

   return {
      encryptedData: arrayBufferToBase64(encryptedBuffer),
      salt: arrayBufferToBase64(salt),
      iv: arrayBufferToBase64(iv),
   };
}

/**
 * Decrypt a password using AES-GCM
 */
export async function decryptPassword(encryptedData: string, salt: string, iv: string, masterPassword: string): Promise<string> {
   const decoder = new TextDecoder();

   const encryptedBuffer = base64ToArrayBuffer(encryptedData);
   const saltBuffer = base64ToArrayBuffer(salt);
   const ivBuffer = base64ToArrayBuffer(iv);

   const key = await deriveKey(masterPassword, new Uint8Array(saltBuffer));

   const decryptedBuffer = await crypto.subtle.decrypt(
      {
         name: ALGORITHM,
         iv: new Uint8Array(ivBuffer),
      },
      key,
      encryptedBuffer
   );

   return decoder.decode(decryptedBuffer);
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
   const bytes = new Uint8Array(buffer);
   let binary = "";
   for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
   }
   return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
   const binaryString = atob(base64);
   const bytes = new Uint8Array(binaryString.length);
   for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
   }
   return bytes.buffer;
}
