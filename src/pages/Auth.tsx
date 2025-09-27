import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Shield, ArrowLeft, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const Auth: React.FC = () => {
   const { theme, toggleTheme } = useTheme();

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
         <div className="w-full max-w-md">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
               <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to Home
                  </Link>
                  <button
                     onClick={toggleTheme}
                     className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                     {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
               </div>

               <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                     <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                     <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                     <div className="text-xs text-gray-500 dark:text-gray-400">Secure Password Manager</div>
                  </div>
               </div>

               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-600 dark:text-gray-300">
                  Your digital security starts here
               </motion.p>
            </motion.div>

            {/* Auth Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <AuthForm />
            </motion.div>
         </div>
      </div>
   );
};

export default Auth;
