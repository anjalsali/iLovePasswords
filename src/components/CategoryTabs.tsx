import React from "react";
import { motion } from "framer-motion";
import type { VaultCategory } from "../types";

interface CategoryTabsProps {
   selectedCategory: VaultCategory | "All";
   onCategoryChange: (category: VaultCategory | "All") => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onCategoryChange }) => {
   const categories: (VaultCategory | "All")[] = ["All", "Social Media", "Email", "Work", "Banking", "Shopping", "Entertainment", "Utilities", "Other"];

   const getCategoryIcon = (category: VaultCategory | "All") => {
      switch (category) {
         case "All":
            return "📋";
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

   return (
      <div className="flex flex-wrap gap-2 mb-6">
         {categories.map((category) => (
            <motion.button
               key={category}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onCategoryChange(category)}
               className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                     ? "bg-blue-600 text-white shadow-lg"
                     : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
               }`}
            >
               <span className="text-lg">{getCategoryIcon(category)}</span>
               <span>{category}</span>
            </motion.button>
         ))}
      </div>
   );
};

export default CategoryTabs;
