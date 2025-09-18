import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import VaultEntry from "./VaultEntry";
import VaultForm from "./VaultForm";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { encryptPassword, decryptPassword } from "../lib/crypto";
import type { DecryptedVaultEntry, PasswordCategory } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Lock, Key, Filter, Tag, Folder, Shield, CreditCard, ShoppingBag, Gamepad2, Settings, Package, Grid, List } from "lucide-react";

const Vault: React.FC = () => {
   const { user } = useAuth();
   const [entries, setEntries] = useState<DecryptedVaultEntry[]>([]);
   const [loading, setLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [editingEntry, setEditingEntry] = useState<DecryptedVaultEntry | null>(null);
   const [masterPassword, setMasterPassword] = useState("");
   const [isUnlocked, setIsUnlocked] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState<PasswordCategory | "All">("All");
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [error, setError] = useState("");

   const categoryIcons = {
      All: Filter,
      "Social Media": Tag,
      Email: Folder,
      Work: Shield,
      Banking: CreditCard,
      Shopping: ShoppingBag,
      Entertainment: Gamepad2,
      Utilities: Settings,
      Other: Package,
   };

   const categoryColors = {
      All: "from-gray-500 to-gray-600",
      "Social Media": "from-pink-500 to-rose-500",
      Email: "from-blue-500 to-cyan-500",
      Work: "from-gray-500 to-slate-500",
      Banking: "from-green-500 to-emerald-500",
      Shopping: "from-orange-500 to-amber-500",
      Entertainment: "from-purple-500 to-violet-500",
      Utilities: "from-indigo-500 to-blue-500",
      Other: "from-gray-400 to-gray-500",
   };

   const filteredEntries = entries.filter((entry) => {
      const matchesSearch =
         entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         entry.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         entry.url?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;

      return matchesSearch && matchesCategory;
   });

   // Group entries by category
   const entriesByCategory = entries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
         acc[category] = [];
      }
      acc[category].push(entry);
      return acc;
   }, {} as Record<PasswordCategory, DecryptedVaultEntry[]>);

   const getCategoryCount = (category: PasswordCategory | "All") => {
      if (category === "All") return entries.length;
      return entriesByCategory[category]?.length || 0;
   };

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
            category: entryData.category,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
               <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Password Vault</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                     Securely manage your {entries.length} password{entries.length !== 1 ? "s" : ""}
                  </p>
               </div>
               <div className="flex items-center space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Button onClick={() => setShowForm(true)} disabled={showForm} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Password
                     </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Button variant="outline" onClick={handleLock} className="border-2">
                        <Lock className="w-4 h-4 mr-2" />
                        Lock Vault
                     </Button>
                  </motion.div>
               </div>
            </motion.div>

            <AnimatePresence>
               {showForm && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
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
                  {/* Search and Filters */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-6">
                     {/* Search Bar */}
                     <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                           type="text"
                           placeholder="Search passwords..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                        />
                     </div>

                     {/* Category Filter */}
                     <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                           <div className="flex items-center space-x-2">
                              <motion.button
                                 onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                 {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                              </motion.button>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                           {(["All", "Social Media", "Email", "Work", "Banking", "Shopping", "Entertainment", "Utilities", "Other"] as const).map((category) => {
                              const IconComponent = categoryIcons[category];
                              const count = getCategoryCount(category);
                              const isSelected = selectedCategory === category;

                              return (
                                 <motion.button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                                       isSelected
                                          ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-800/50"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                 >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${categoryColors[category]}`}>
                                       <IconComponent className="w-3 h-3 text-white" />
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>{category}</span>
                                    <span
                                       className={`text-xs px-2 py-1 rounded-full ${
                                          isSelected ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                       }`}
                                    >
                                       {count}
                                    </span>
                                 </motion.button>
                              );
                           })}
                        </div>
                     </div>
                  </motion.div>

                  {/* Error Display */}
                  <AnimatePresence>
                     {error && (
                        <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
                        >
                           {error}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* Entries Display */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                     <AnimatePresence>
                        {filteredEntries.length === 0 ? (
                           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center py-16">
                              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-6">
                                 <Lock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{entries.length === 0 ? "No passwords stored yet" : "No passwords match your search"}</h3>
                              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                 {entries.length === 0 ? "Add your first password to get started with your secure vault." : "Try adjusting your search terms or changing the category filter."}
                              </p>
                              {entries.length === 0 && (
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button onClick={() => setShowForm(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                                       <Plus className="w-5 h-5 mr-2" />
                                       Add Your First Password
                                    </Button>
                                 </motion.div>
                              )}
                           </motion.div>
                        ) : (
                           <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}`}>
                              {filteredEntries.map((entry, index) => (
                                 <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }}>
                                    <VaultEntry entry={entry} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
                                 </motion.div>
                              ))}
                           </div>
                        )}
                     </AnimatePresence>
                  </motion.div>
               </>
            )}
         </div>
      </div>
   );
};

export default Vault;
