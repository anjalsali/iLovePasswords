// Encryption utilities for password management

// Generate a random salt
export const generateSalt = (): string => {
   const array = new Uint8Array(16);
   crypto.getRandomValues(array);
   return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Generate a random IV
export const generateIV = (): string => {
   const array = new Uint8Array(12);
   crypto.getRandomValues(array);
   return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Derive key from master password using PBKDF2
export const deriveKey = async (masterPassword: string, salt: string): Promise<CryptoKey> => {
   const encoder = new TextEncoder();
   const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(masterPassword), "PBKDF2", false, ["deriveBits", "deriveKey"]);

   return crypto.subtle.deriveKey(
      {
         name: "PBKDF2",
         salt: encoder.encode(salt),
         iterations: 100000,
         hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
   );
};

// Encrypt password
export const encryptPassword = async (
   password: string,
   masterPassword: string
): Promise<{
   encryptedPassword: string;
   salt: string;
   iv: string;
}> => {
   const salt = generateSalt();
   const iv = generateIV();
   const key = await deriveKey(masterPassword, salt);

   const encoder = new TextEncoder();
   const data = encoder.encode(password);

   const encrypted = await crypto.subtle.encrypt(
      {
         name: "AES-GCM",
         iv: new Uint8Array(Array.from(iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))),
      },
      key,
      data
   );

   const encryptedArray = new Uint8Array(encrypted);
   const encryptedHex = Array.from(encryptedArray, (byte) => byte.toString(16).padStart(2, "0")).join("");

   return {
      encryptedPassword: encryptedHex,
      salt,
      iv,
   };
};

// Decrypt password
export const decryptPassword = async (encryptedPassword: string, salt: string, iv: string, masterPassword: string): Promise<string> => {
   const key = await deriveKey(masterPassword, salt);

   const encryptedArray = new Uint8Array(Array.from(encryptedPassword.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))));

   const decrypted = await crypto.subtle.decrypt(
      {
         name: "AES-GCM",
         iv: new Uint8Array(Array.from(iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))),
      },
      key,
      encryptedArray
   );

   const decoder = new TextDecoder();
   return decoder.decode(decrypted);
};

// Hash master password for storage
export const hashMasterPassword = async (password: string): Promise<string> => {
   const encoder = new TextEncoder();
   const data = encoder.encode(password);
   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
   const hashArray = new Uint8Array(hashBuffer);
   return Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Verify master password
export const verifyMasterPassword = async (password: string, hash: string): Promise<boolean> => {
   const passwordHash = await hashMasterPassword(password);
   return passwordHash === hash;
};
