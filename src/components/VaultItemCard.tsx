import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import type { VaultEntry, VaultCategory } from "../types";
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink, Check, Calendar, User } from "lucide-react";
import { copyToClipboard } from "../lib/utils";

interface VaultItemCardProps {
   entry: VaultEntry;
   onEdit: (entry: VaultEntry) => void;
   onDelete: (entry: VaultEntry) => void;
   onDecryptPassword: () => Promise<string>;
}

const VaultItemCard: React.FC<VaultItemCardProps> = ({ entry, onEdit, onDelete, onDecryptPassword }) => {
   const [showPassword, setShowPassword] = useState(false);
   const [decryptedPassword, setDecryptedPassword] = useState<string>("");
   const [isDecrypting, setIsDecrypting] = useState(false);
   const [copied, setCopied] = useState(false);
   const [copiedPassword, setCopiedPassword] = useState(false);

   const getCategoryIcon = (category: VaultCategory) => {
      switch (category) {
         case "Social Media":
            return "📱";
         case "Email":
            return "📧";
         case "Work":
            return "💼";
         case "Banking":
            return "🏦";
         case "Shopping":
            return "🛒";
         case "Entertainment":
            return "🎬";
         case "Utilities":
            return "⚡";
         case "Other":
            return "📁";
         default:
            return "📁";
      }
   };

   const handleTogglePassword = async () => {
      if (!showPassword && !decryptedPassword) {
         setIsDecrypting(true);
         try {
            const password = await onDecryptPassword();
            setDecryptedPassword(password);
         } catch (error) {
            console.error("Failed to decrypt password:", error);
         } finally {
            setIsDecrypting(false);
         }
      }
      setShowPassword(!showPassword);
   };

   const handleCopyUsername = async () => {
      if (entry.username && (await copyToClipboard(entry.username))) {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
   };

   const handleCopyPassword = async () => {
      const passwordToCopy = showPassword ? decryptedPassword : "";
      if (passwordToCopy && (await copyToClipboard(passwordToCopy))) {
         setCopiedPassword(true);
         setTimeout(() => setCopiedPassword(false), 2000);
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
         <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                     <span className="text-2xl">{getCategoryIcon(entry.category)}</span>
                     <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{entry.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{entry.category}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               {/* Username */}
               {entry.username && (
                  <div className="mb-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <User className="h-4 w-4 text-gray-500" />
                           <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCopyUsername} className="h-6 w-6">
                           <AnimatePresence mode="wait">
                              {copied ? (
                                 <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    <Check className="h-3 w-3 text-green-500" />
                                 </motion.div>
                              ) : (
                                 <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    <Copy className="h-3 w-3" />
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </Button>
                     </div>
                     <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">{entry.username}</p>
                  </div>
               )}

               {/* Password */}
               <div className="mb-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600 dark:text-gray-400">Password:</span>
                     <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={handleTogglePassword} className="h-6 w-6" disabled={isDecrypting}>
                           {isDecrypting ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                 <Eye className="h-3 w-3" />
                              </motion.div>
                           ) : showPassword ? (
                              <EyeOff className="h-3 w-3" />
                           ) : (
                              <Eye className="h-3 w-3" />
                           )}
                        </Button>
                        {showPassword && decryptedPassword && (
                           <Button variant="ghost" size="icon" onClick={handleCopyPassword} className="h-6 w-6">
                              <AnimatePresence mode="wait">
                                 {copiedPassword ? (
                                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                       <Check className="h-3 w-3 text-green-500" />
                                    </motion.div>
                                 ) : (
                                    <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                       <Copy className="h-3 w-3" />
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </Button>
                        )}
                     </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">
                     {showPassword ? (
                        <p className="text-gray-900 dark:text-white font-mono text-sm">{decryptedPassword || "••••••••••••"}</p>
                     ) : (
                        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">••••••••••••</p>
                     )}
                  </div>
               </div>

               {/* URL */}
               {entry.url && (
                  <div className="mb-4">
                     <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate">
                           {entry.url}
                        </a>
                     </div>
                  </div>
               )}

               {/* Date */}
               <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(entry.created_at)}</span>
               </div>
            </CardContent>
         </Card>
      </motion.div>
   );
};

export default VaultItemCard;
