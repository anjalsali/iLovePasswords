import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import VaultList from "../components/VaultList";
import CategoryTabs from "../components/CategoryTabs";
import PasswordGeneratorCard from "../components/PasswordGeneratorCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { VaultEntry, VaultCategory, CreateVaultEntryData } from "../types";
import { Plus, Key } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// Global interface for generated password
declare global {
   interface Window {
      generatedPassword?: string;
   }
}

const Vault: React.FC = () => {
   const { user } = useAuth();
   const [entries, setEntries] = useState<VaultEntry[]>([]);
   const [filteredEntries, setFilteredEntries] = useState<VaultEntry[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<VaultCategory | "All">("All");
   const [loading, setLoading] = useState(true);
   const [showAddForm, setShowAddForm] = useState(false);
   const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
   const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState<VaultEntry | null>(null);

   // Mock data for now - in real app, this would come from Supabase
   useEffect(() => {
      const mockEntries: VaultEntry[] = [
         {
            id: "1",
            user_id: user?.id || "",
            title: "GitHub",
            username: "user@example.com",
            url: "https://github.com",
            category: "Work",
            encrypted_password: "encrypted_data_1",
            salt: "salt_1",
            iv: "iv_1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         },
         {
            id: "2",
            user_id: user?.id || "",
            title: "Netflix",
            username: "user@example.com",
            url: "https://netflix.com",
            category: "Entertainment",
            encrypted_password: "encrypted_data_2",
            salt: "salt_2",
            iv: "iv_2",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
         },
         {
            id: "3",
            user_id: user?.id || "",
            title: "Bank of America",
            username: "user@example.com",
            category: "Banking",
            encrypted_password: "encrypted_data_3",
            salt: "salt_3",
            iv: "iv_3",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
         },
      ];

      setEntries(mockEntries);
      setFilteredEntries(mockEntries);
      setLoading(false);
   }, [user]);

   // Filter entries by category
   useEffect(() => {
      if (selectedCategory === "All") {
         setFilteredEntries(entries);
      } else {
         setFilteredEntries(entries.filter((entry) => entry.category === selectedCategory));
      }
   }, [selectedCategory, entries]);

   const handleAddNew = () => {
      setShowAddForm(true);
      setEditingEntry(null);
   };

   const handleGeneratePassword = () => {
      setShowPasswordGenerator(true);
   };

   const handlePasswordGenerated = (data: CreateVaultEntryData) => {
      // Close password generator and open form with generated password
      setShowPasswordGenerator(false);
      setEditingEntry(null);
      setShowAddForm(true);
      // Store the generated password to use in the form
      window.generatedPassword = data.password;
   };

   const handleEdit = (entry: VaultEntry) => {
      setEditingEntry(entry);
      setShowAddForm(true);
   };

   const handleDelete = async (entry: VaultEntry) => {
      setShowDeleteConfirm(entry);
   };

   const confirmDelete = async () => {
      if (showDeleteConfirm) {
         // TODO: Implement delete functionality
         console.log("Deleting entry:", showDeleteConfirm.id);
         setEntries((prev) => prev.filter((e) => e.id !== showDeleteConfirm.id));
         setShowDeleteConfirm(null);
      }
   };

   const handleDecryptPassword = async (): Promise<string> => {
      // For demo purposes, return a mock password
      // In real app, this would decrypt using the master password
      return "mock_decrypted_password_123!";
   };

   const handleSaveEntry = async (data: CreateVaultEntryData) => {
      try {
         // TODO: Implement encryption and save to Supabase
         console.log("Saving entry:", data);

         if (editingEntry) {
            // Update existing entry
            const updatedEntry: VaultEntry = {
               ...editingEntry,
               title: data.title,
               username: data.username,
               url: data.url,
               category: data.category,
               encrypted_password: data.password ? "encrypted_" + data.password : editingEntry.encrypted_password,
               salt: data.password ? "salt_" + Date.now() : editingEntry.salt,
               iv: data.password ? "iv_" + Date.now() : editingEntry.iv,
               updated_at: new Date().toISOString(),
            };
            setEntries((prev) => prev.map((e) => (e.id === editingEntry.id ? updatedEntry : e)));
         } else {
            // Create new entry
            const newEntry: VaultEntry = {
               id: Date.now().toString(),
               user_id: user?.id || "",
               title: data.title,
               username: data.username,
               url: data.url,
               category: data.category,
               encrypted_password: "encrypted_" + data.password,
               salt: "salt_" + Date.now(),
               iv: "iv_" + Date.now(),
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            };
            setEntries((prev) => [newEntry, ...prev]);
         }

         setShowAddForm(false);
         setEditingEntry(null);
      } catch (error) {
         console.error("Error saving entry:", error);
      }
   };

   if (loading) {
      return (
         <DashboardLayout>
            <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Vault</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                     {entries.length} password{entries.length !== 1 ? "s" : ""} stored • Manage and organize your saved passwords
                  </p>
               </div>
               <div className="flex gap-3">
                  <Button
                     onClick={handleGeneratePassword}
                     variant="outline"
                     className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                     <Key className="w-4 h-4 mr-2" />
                     Generate Password
                  </Button>
                  <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                     <Plus className="w-4 h-4 mr-2" />
                     Add Password
                  </Button>
               </div>
            </div>

            {/* Category Tabs */}
            <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

            {/* Vault List */}
            <VaultList entries={filteredEntries} onEdit={handleEdit} onDelete={handleDelete} onDecryptPassword={handleDecryptPassword} onAddNew={handleAddNew} />

            {/* Add/Edit Form Modal */}
            {showAddForm && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowAddForm(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingEntry ? "Edit Password" : "Add New Password"}</h2>
                        <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     </div>

                     <VaultForm entry={editingEntry} onSave={handleSaveEntry} onCancel={() => setShowAddForm(false)} />
                  </motion.div>
               </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowDeleteConfirm(null)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                           <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                           </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                           Are you sure you want to delete "<span className="font-medium">{showDeleteConfirm.title}</span>"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                           <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1">
                              Cancel
                           </Button>
                           <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                              Delete
                           </Button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {/* Password Generator Modal */}
            {showPasswordGenerator && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowPasswordGenerator(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Secure Password</h2>
                        <button onClick={() => setShowPasswordGenerator(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     </div>
                     <PasswordGeneratorCard onSavePassword={handlePasswordGenerated} />
                  </motion.div>
               </motion.div>
            )}
         </motion.div>
      </DashboardLayout>
   );
};

// Vault Form Component
interface VaultFormProps {
   entry?: VaultEntry | null;
   onSave: (data: CreateVaultEntryData) => void;
   onCancel: () => void;
}

const VaultForm: React.FC<VaultFormProps> = ({ entry, onSave, onCancel }) => {
   const [formData, setFormData] = useState({
      title: entry?.title || "",
      username: entry?.username || "",
      url: entry?.url || "",
      category: (entry?.category || "Other") as VaultCategory,
      password: window.generatedPassword || "",
   });

   // Clear generated password after using it
   useEffect(() => {
      if (window.generatedPassword) {
         window.generatedPassword = undefined;
      }
   }, []);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.title.trim()) {
         newErrors.title = "Site/App name is required";
      }

      if (!entry && !formData.password.trim()) {
         newErrors.password = "Password is required for new entries";
      }

      if (formData.url && !isValidUrl(formData.url)) {
         newErrors.url = "Please enter a valid URL";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const isValidUrl = (url: string) => {
      try {
         new URL(url);
         return true;
      } catch {
         return false;
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setIsSubmitting(true);
      try {
         await onSave(formData);
      } catch (error) {
         console.error("Error saving entry:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site/App Name *</label>
            <Input
               value={formData.title}
               onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
               }}
               placeholder="e.g., GitHub, Netflix"
               required
               className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username/Email</label>
            <Input value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} placeholder="your@email.com" />
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <Input
               value={formData.url}
               onChange={(e) => {
                  setFormData((prev) => ({ ...prev, url: e.target.value }));
                  if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
               }}
               placeholder="https://example.com"
               className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
               value={formData.category}
               onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as VaultCategory }))}
               className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
               <option value="Other">Other</option>
               <option value="Social Media">Social Media</option>
               <option value="Email">Email</option>
               <option value="Work">Work</option>
               <option value="Banking">Banking</option>
               <option value="Shopping">Shopping</option>
               <option value="Entertainment">Entertainment</option>
               <option value="Utilities">Utilities</option>
            </select>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password {!entry ? "*" : "(leave blank to keep current)"}</label>
            <Input
               type="password"
               value={formData.password}
               onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
               }}
               placeholder={entry ? "Enter new password (optional)" : "Enter your password"}
               required={!entry}
               className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
         </div>

         <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting || !formData.title || (!formData.password && !entry)}>
               {isSubmitting ? "Saving..." : entry ? "Update" : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
               Cancel
            </Button>
         </div>
      </form>
   );
};

export default Vault;
