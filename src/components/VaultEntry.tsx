import React, { useState } from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import type { DecryptedVaultEntry } from "../types";
import { copyToClipboard } from "../lib/utils";
import { Copy, Edit, Trash2, Eye, EyeOff, Globe, User } from "lucide-react";
import { motion } from "framer-motion";

interface VaultEntryProps {
   entry: DecryptedVaultEntry;
   onEdit: (entry: DecryptedVaultEntry) => void;
   onDelete: (id: string) => void;
}

const VaultEntry: React.FC<VaultEntryProps> = ({ entry, onEdit, onDelete }) => {
   const [showPassword, setShowPassword] = useState(false);
   const [copied, setCopied] = useState<string | null>(null);

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
         <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
               <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                     <h3 className="font-semibold text-lg">{entry.title}</h3>
                     {entry.url && (
                        <a
                           href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                           <Globe className="w-3 h-3" />
                           {entry.url}
                        </a>
                     )}
                  </div>
                  <div className="flex items-center space-x-1">
                     <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <div className="space-y-3">
                  {/* Username */}
                  {entry.username && (
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Username</label>
                        <div className="flex items-center space-x-2">
                           <div className="flex items-center space-x-2 flex-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{entry.username}</span>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => handleCopy(entry.username!, "username")} className="h-8 w-8">
                              <Copy className={`h-4 w-4 ${copied === "username" ? "text-green-500" : ""}`} />
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Password */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-muted-foreground">Password</label>
                     <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                           <Input type={showPassword ? "text" : "password"} value={entry.password} readOnly className="pr-10 font-mono text-sm" />
                           <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-10 w-10">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(entry.password, "password")} className="h-10 w-10">
                           <Copy className={`h-4 w-4 ${copied === "password" ? "text-green-500" : ""}`} />
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Copy Feedback */}
               {copied && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xs text-green-600 mt-2">
                     {copied === "username" ? "Username" : "Password"} copied to clipboard!
                  </motion.div>
               )}

               {/* Metadata */}
               <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  Created: {new Date(entry.created_at).toLocaleDateString()}
                  {entry.updated_at !== entry.created_at && <> • Updated: {new Date(entry.updated_at).toLocaleDateString()}</>}
               </div>
            </CardContent>
         </Card>
      </motion.div>
   );
};

export default VaultEntry;
