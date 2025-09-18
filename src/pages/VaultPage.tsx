import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Vault from "../components/Vault";
import { Link } from "react-router-dom";
import { Shield, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

const VaultPage: React.FC = () => {
   const { user, signOut, loading } = useAuth();
   const { theme, toggleTheme } = useTheme();

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
               <p className="text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return <Navigate to="/auth" replace />;
   }

   const handleSignOut = async () => {
      try {
         await signOut();
      } catch (error) {
         console.error("Sign out error:", error);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
         {/* Header */}
         <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-4">
                     <Link to="/" className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                           <Shield className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                           <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                           <div className="text-xs text-gray-500 dark:text-gray-400">Password Vault</div>
                        </div>
                     </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                     <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                     >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                     </motion.button>
                     <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                           <span className="text-xs font-bold text-white">{user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{user.email}</span>
                     </div>
                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" onClick={handleSignOut} className="border-2">
                           <LogOut className="w-4 h-4 mr-2" />
                           Sign Out
                        </Button>
                     </motion.div>
                  </div>
               </div>
            </div>
         </motion.header>

         {/* Vault Component */}
         <Vault />
      </div>
   );
};

export default VaultPage;
