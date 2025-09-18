import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import type { DecryptedVaultEntry, PasswordCategory } from "../types";
import { motion } from "framer-motion";
import { Save, X, Tag, Folder, Shield, CreditCard, ShoppingBag, Gamepad2, Settings, Package } from "lucide-react";

interface VaultFormProps {
   entry?: DecryptedVaultEntry | null;
   onSave: (entryData: Omit<DecryptedVaultEntry, "id" | "user_id" | "created_at" | "updated_at" | "encrypted_password" | "salt" | "iv">) => void;
   onCancel: () => void;
   loading?: boolean;
}

const VaultForm: React.FC<VaultFormProps> = ({ entry, onSave, onCancel, loading = false }) => {
   const [formData, setFormData] = useState({
      title: "",
      username: "",
      url: "",
      password: "",
      category: "Other" as PasswordCategory,
   });

   const categoryIcons = {
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
      "Social Media": "from-pink-500 to-rose-500",
      Email: "from-blue-500 to-cyan-500",
      Work: "from-gray-500 to-slate-500",
      Banking: "from-green-500 to-emerald-500",
      Shopping: "from-orange-500 to-amber-500",
      Entertainment: "from-purple-500 to-violet-500",
      Utilities: "from-indigo-500 to-blue-500",
      Other: "from-gray-400 to-gray-500",
   };

   useEffect(() => {
      if (entry) {
         setFormData({
            title: entry.title,
            username: entry.username || "",
            url: entry.url || "",
            password: entry.password,
            category: entry.category,
         });
      } else {
         setFormData({
            title: "",
            username: "",
            url: "",
            password: "",
            category: "Other" as PasswordCategory,
         });
      }
   }, [entry]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.password.trim()) {
         return;
      }
      onSave(formData);
   };

   const handleChange = (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl mx-auto">
         <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader className="text-center">
               <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{entry ? "Edit Password Entry" : "Add New Password"}</CardTitle>
               <CardDescription className="text-gray-600 dark:text-gray-300">{entry ? "Update your password entry details" : "Add a new password to your secure vault"}</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Title <span className="text-red-500">*</span>
                     </label>
                     <Input
                        type="text"
                        placeholder="e.g., Gmail, Facebook, Work Email"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                     />
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(categoryIcons).map(([category, IconComponent]) => {
                           const isSelected = formData.category === category;
                           return (
                              <motion.button
                                 key={category}
                                 type="button"
                                 onClick={() => handleChange("category", category as PasswordCategory)}
                                 className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected
                                       ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                 }`}
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                              >
                                 <div className="flex flex-col items-center space-y-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${categoryColors[category as PasswordCategory]}`}>
                                       <IconComponent className="w-4 h-4 text-white" />
                                    </div>
                                    <span className={`text-xs font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>{category}</span>
                                 </div>
                              </motion.button>
                           );
                        })}
                     </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username/Email</label>
                     <Input
                        type="text"
                        placeholder="Enter username or email"
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                     />
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website URL</label>
                     <Input
                        type="url"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={(e) => handleChange("url", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                     />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Password <span className="text-red-500">*</span>
                     </label>
                     <Input
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                     />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-6">
                     <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                           type="submit"
                           className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                           disabled={loading || !formData.title.trim() || !formData.password.trim()}
                        >
                           <Save className="w-5 h-5 mr-2" />
                           {loading ? "Saving..." : entry ? "Update Password" : "Save Password"}
                        </Button>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="h-12 px-6 border-2">
                           <X className="w-5 h-5 mr-2" />
                           Cancel
                        </Button>
                     </motion.div>
                  </div>
               </form>
            </CardContent>
         </Card>
      </motion.div>
   );
};

export default VaultForm;
