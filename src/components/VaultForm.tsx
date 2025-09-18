import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { DecryptedVaultEntry } from "../types";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";

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
   });

   useEffect(() => {
      if (entry) {
         setFormData({
            title: entry.title,
            username: entry.username || "",
            url: entry.url || "",
            password: entry.password,
         });
      } else {
         setFormData({
            title: "",
            username: "",
            url: "",
            password: "",
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto">
         <Card>
            <CardHeader>
               <CardTitle>{entry ? "Edit Password Entry" : "Add New Password"}</CardTitle>
               <CardDescription>{entry ? "Update your password entry details" : "Add a new password to your secure vault"}</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                     </label>
                     <Input type="text" placeholder="e.g., Gmail, Facebook, Work Email" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Username/Email</label>
                     <Input type="text" placeholder="Enter username or email" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Website URL</label>
                     <Input type="url" placeholder="https://example.com" value={formData.url} onChange={(e) => handleChange("url", e.target.value)} />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">
                        Password <span className="text-red-500">*</span>
                     </label>
                     <Input type="password" placeholder="Enter password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-2 pt-4">
                     <Button type="submit" className="flex-1" disabled={loading || !formData.title.trim() || !formData.password.trim()}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : entry ? "Update" : "Save"}
                     </Button>
                     <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </motion.div>
   );
};

export default VaultForm;
