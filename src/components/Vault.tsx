import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import VaultEntry from "./VaultEntry";
import VaultForm from "./VaultForm";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { encryptPassword, decryptPassword } from "../lib/crypto";
import type { DecryptedVaultEntry } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Lock, Key } from "lucide-react";

const Vault: React.FC = () => {
   const { user } = useAuth();
   const [entries, setEntries] = useState<DecryptedVaultEntry[]>([]);
   const [loading, setLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [editingEntry, setEditingEntry] = useState<DecryptedVaultEntry | null>(null);
   const [masterPassword, setMasterPassword] = useState("");
   const [isUnlocked, setIsUnlocked] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [error, setError] = useState("");

   const filteredEntries = entries.filter(
      (entry) =>
         entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || entry.username?.toLowerCase().includes(searchTerm.toLowerCase()) || entry.url?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleUnlock = async () => {
      if (!masterPassword.trim()) {
         setError("Please enter your master password");
         return;
      }

      try {
         setLoading(true);
         setError("");
         await loadVaultEntries(masterPassword);
         setIsUnlocked(true);
      } catch (error: unknown) {
         setError("Invalid master password or failed to decrypt vault");
         console.error("Unlock error:", error);
      } finally {
         setLoading(false);
      }
   };

   const loadVaultEntries = async (masterPass: string) => {
      if (!user) return;

      const { data, error } = await supabase.from("vault_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

      if (error) throw error;

      const decryptedEntries: DecryptedVaultEntry[] = [];

      for (const entry of data || []) {
         try {
            const decryptedPassword = await decryptPassword(entry.encrypted_password, entry.salt, entry.iv, masterPass);
            decryptedEntries.push({
               ...entry,
               password: decryptedPassword,
            });
         } catch (error) {
            console.error("Failed to decrypt entry:", entry.id, error);
            // Skip entries that can't be decrypted
         }
      }

      setEntries(decryptedEntries);
   };

   const handleSaveEntry = async (entryData: Omit<DecryptedVaultEntry, "id" | "user_id" | "created_at" | "updated_at" | "encrypted_password" | "salt" | "iv">) => {
      if (!user || !masterPassword) return;

      try {
         setLoading(true);
         const { encryptedData, salt, iv } = await encryptPassword(entryData.password, masterPassword);

         const vaultEntry = {
            user_id: user.id,
            title: entryData.title,
            username: entryData.username || null,
            url: entryData.url || null,
            encrypted_password: encryptedData,
            salt,
            iv,
         };

         if (editingEntry) {
            // Update existing entry
            const { error } = await supabase.from("vault_entries").update(vaultEntry).eq("id", editingEntry.id);

            if (error) throw error;

            setEntries((prev) =>
               prev.map((entry) =>
                  entry.id === editingEntry.id
                     ? {
                          ...entry,
                          ...entryData,
                          updated_at: new Date().toISOString(),
                       }
                     : entry
               )
            );
         } else {
            // Create new entry
            const { data, error } = await supabase.from("vault_entries").insert([vaultEntry]).select().single();

            if (error) throw error;

            const newEntry: DecryptedVaultEntry = {
               ...data,
               password: entryData.password,
            };

            setEntries((prev) => [newEntry, ...prev]);
         }

         setShowForm(false);
         setEditingEntry(null);
      } catch (error: unknown) {
         setError("Failed to save entry: " + (error instanceof Error ? error.message : "Unknown error"));
         console.error("Save error:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteEntry = async (id: string) => {
      try {
         const { error } = await supabase.from("vault_entries").delete().eq("id", id);

         if (error) throw error;

         setEntries((prev) => prev.filter((entry) => entry.id !== id));
      } catch (error: unknown) {
         setError("Failed to delete entry: " + (error instanceof Error ? error.message : "Unknown error"));
         console.error("Delete error:", error);
      }
   };

   const handleEditEntry = (entry: DecryptedVaultEntry) => {
      setEditingEntry(entry);
      setShowForm(true);
   };

   const handleLock = () => {
      setIsUnlocked(false);
      setMasterPassword("");
      setEntries([]);
      setShowForm(false);
      setEditingEntry(null);
   };

   // Show unlock screen if not unlocked
   if (!isUnlocked) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
               <Card>
                  <CardHeader className="text-center">
                     <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                     </div>
                     <CardTitle>Unlock Your Vault</CardTitle>
                     <CardDescription>Enter your master password to access your stored passwords</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Master Password</label>
                        <div className="relative">
                           <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                              type="password"
                              placeholder="Enter your master password"
                              value={masterPassword}
                              onChange={(e) => setMasterPassword(e.target.value)}
                              className="pl-10"
                              onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
                           />
                        </div>
                     </div>

                     {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                           {error}
                        </motion.div>
                     )}

                     <Button onClick={handleUnlock} className="w-full" size="lg" disabled={loading || !masterPassword.trim()}>
                        {loading ? "Unlocking..." : "Unlock Vault"}
                     </Button>
                  </CardContent>
               </Card>
            </motion.div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
         <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Password Vault</h1>
                  <p className="text-gray-600">Securely manage your passwords</p>
               </div>
               <div className="flex space-x-2">
                  <Button onClick={() => setShowForm(true)} disabled={showForm}>
                     <Plus className="w-4 h-4 mr-2" />
                     Add Password
                  </Button>
                  <Button variant="outline" onClick={handleLock}>
                     <Lock className="w-4 h-4 mr-2" />
                     Lock Vault
                  </Button>
               </div>
            </div>

            <AnimatePresence>
               {showForm && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
                     <VaultForm
                        entry={editingEntry}
                        onSave={handleSaveEntry}
                        onCancel={() => {
                           setShowForm(false);
                           setEditingEntry(null);
                        }}
                        loading={loading}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            {!showForm && (
               <>
                  {/* Search */}
                  <div className="mb-6">
                     <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="text" placeholder="Search passwords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                     </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {error}
                     </motion.div>
                  )}

                  {/* Entries List */}
                  <div className="space-y-4">
                     <AnimatePresence>
                        {filteredEntries.length === 0 ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                 <Lock className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{entries.length === 0 ? "No passwords stored yet" : "No passwords match your search"}</h3>
                              <p className="text-gray-500 mb-4">{entries.length === 0 ? "Add your first password to get started with your secure vault." : "Try adjusting your search terms."}</p>
                              {entries.length === 0 && (
                                 <Button onClick={() => setShowForm(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Your First Password
                                 </Button>
                              )}
                           </motion.div>
                        ) : (
                           filteredEntries.map((entry) => <VaultEntry key={entry.id} entry={entry} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />)
                        )}
                     </AnimatePresence>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default Vault;
