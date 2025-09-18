import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Shield, ArrowLeft, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const Auth: React.FC = () => {
   const { theme, toggleTheme } = useTheme();

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4 transition-colors duration-300">
         <div className="w-full max-w-md">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
               <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to Home
                  </Link>
                  <motion.button
                     onClick={toggleTheme}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors backdrop-blur-sm"
                  >
                     {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.button>
               </div>

               <motion.div className="flex items-center justify-center space-x-3 mb-6" whileHover={{ scale: 1.02 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                     <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                     <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                     <div className="text-xs text-gray-500 dark:text-gray-400">Secure Password Manager</div>
                  </div>
               </motion.div>

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
