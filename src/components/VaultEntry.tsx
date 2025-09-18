import React, { useState } from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import type { DecryptedVaultEntry, PasswordCategory } from "../types";
import { copyToClipboard } from "../lib/utils";
import { Copy, Edit, Trash2, Eye, EyeOff, Globe, User, Tag, Folder, Shield, CreditCard, ShoppingBag, Gamepad2, Settings, Package } from "lucide-react";
import { motion } from "framer-motion";

interface VaultEntryProps {
   entry: DecryptedVaultEntry;
   onEdit: (entry: DecryptedVaultEntry) => void;
   onDelete: (id: string) => void;
}

const VaultEntry: React.FC<VaultEntryProps> = ({ entry, onEdit, onDelete }) => {
   const [showPassword, setShowPassword] = useState(false);
   const [copied, setCopied] = useState<string | null>(null);

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

   const CategoryIcon = categoryIcons[entry.category as PasswordCategory] || Package;

   const handleCopy = async (text: string, type: string) => {
      if (await copyToClipboard(text)) {
         setCopied(type);
         setTimeout(() => setCopied(null), 2000);
      }
   };

   const handleEdit = () => {
      onEdit(entry);
   };

   const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this password entry?")) {
         onDelete(entry.id);
      }
   };

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} whileHover={{ y: -2 }}>
         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                     <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryColors[entry.category as PasswordCategory]} shadow-md`}>
                           <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg text-gray-900 dark:text-white">{entry.title}</h3>
                           <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{entry.category}</span>
                        </div>
                     </div>
                     {entry.url && (
                        <motion.a
                           href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 mt-2 hover:underline"
                           whileHover={{ x: 2 }}
                        >
                           <Globe className="w-4 h-4" />
                           <span className="truncate">{entry.url}</span>
                        </motion.a>
                     )}
                  </div>
                  <div className="flex items-center space-x-2">
                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" onClick={handleEdit} className="h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                           <Edit className="h-4 w-4" />
                        </Button>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" onClick={handleDelete} className="h-10 w-10 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </motion.div>
                  </div>
               </div>

               <div className="space-y-4">
                  {/* Username */}
                  {entry.username && (
                     <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Username</label>
                        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                           <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{entry.username}</span>
                           </div>
                           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="icon" onClick={() => handleCopy(entry.username!, "username")} className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600">
                                 <Copy className={`h-4 w-4 ${copied === "username" ? "text-green-500" : "text-gray-500"}`} />
                              </Button>
                           </motion.div>
                        </div>
                     </div>
                  )}

                  {/* Password */}
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Password</label>
                     <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="relative flex-1">
                           <Input type={showPassword ? "text" : "password"} value={entry.password} readOnly className="pr-12 font-mono text-sm border-0 bg-transparent focus:ring-0 focus:border-0" />
                           <motion.div className="absolute right-0 top-0 h-full flex items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600">
                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                           </motion.div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                           <Button variant="ghost" size="icon" onClick={() => handleCopy(entry.password, "password")} className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600">
                              <Copy className={`h-4 w-4 ${copied === "password" ? "text-green-500" : "text-gray-500"}`} />
                           </Button>
                        </motion.div>
                     </div>
                  </div>
               </div>

               {/* Copy Feedback */}
               {copied && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.8 }} className="mt-4">
                     <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-full text-xs font-medium">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                           <Copy className="w-3 h-3" />
                        </motion.div>
                        <span>{copied === "username" ? "Username" : "Password"} copied!</span>
                     </div>
                  </motion.div>
               )}

               {/* Metadata */}
               <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <span>Created: {new Date(entry.created_at).toLocaleDateString()}</span>
                  {entry.updated_at !== entry.created_at && <span>Updated: {new Date(entry.updated_at).toLocaleDateString()}</span>}
               </div>
            </CardContent>
         </Card>
      </motion.div>
   );
};

export default VaultEntry;
