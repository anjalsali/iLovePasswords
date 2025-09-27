import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VaultEntry } from "../types";
import VaultItemCard from "./VaultItemCard";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Search, Plus, Filter } from "lucide-react";

interface VaultListProps {
   entries: VaultEntry[];
   onEdit: (entry: VaultEntry) => void;
   onDelete: (entry: VaultEntry) => void;
   onDecryptPassword: () => Promise<string>;
   onAddNew: () => void;
}

const VaultList: React.FC<VaultListProps> = ({ entries, onEdit, onDelete, onDecryptPassword, onAddNew }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [sortBy, setSortBy] = useState<"title" | "category" | "created_at">("created_at");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

   const filteredEntries = entries
      .filter(
         (entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
         let aValue: string | number;
         let bValue: string | number;

         switch (sortBy) {
            case "title":
               aValue = a.title.toLowerCase();
               bValue = b.title.toLowerCase();
               break;
            case "category":
               aValue = a.category.toLowerCase();
               bValue = b.category.toLowerCase();
               break;
            case "created_at":
               aValue = new Date(a.created_at).getTime();
               bValue = new Date(b.created_at).getTime();
               break;
            default:
               aValue = a.title.toLowerCase();
               bValue = b.title.toLowerCase();
         }

         if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
         } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
         }
      });

   return (
      <div className="space-y-6">
         {/* Search and Filters */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
               <Input placeholder="Search passwords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "title" | "category" | "created_at")}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
               >
                  <option value="created_at">Date Created</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
               </select>
               <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="px-3">
                  <Filter className="w-4 h-4" />
                  {sortOrder === "asc" ? "↑" : "↓"}
               </Button>
            </div>
         </div>

         {/* Results */}
         {filteredEntries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
               <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{searchTerm ? "No passwords found" : "No passwords yet"}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{searchTerm ? "Try adjusting your search terms" : "Add your first password to get started"}</p>
               </div>
               {!searchTerm && (
                  <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                     <Plus className="w-4 h-4 mr-2" />
                     Add Your First Password
                  </Button>
               )}
            </motion.div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <AnimatePresence>
                  {filteredEntries.map((entry) => (
                     <VaultItemCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} onDecryptPassword={onDecryptPassword} />
                  ))}
               </AnimatePresence>
            </div>
         )}
      </div>
   );
};

export default VaultList;
