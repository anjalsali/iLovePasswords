import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Shield, ArrowLeft, Moon, Sun, Lock } from "lucide-react";
import { motion } from "framer-motion";
import logoImage from "../assets/ilovepasswordslogo.png";

const Auth: React.FC = () => {
   const { theme, toggleTheme } = useTheme();

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         {/* Professional Navbar */}
         <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                        <img src={logoImage} alt="iLovePasswords Logo" className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Secure Password Manager</div>
                     </div>
                  </div>

                  <div className="flex items-center space-x-4">
                     <Link
                        to="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                     >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                     </Link>
                     <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Secure</span>
                     </div>
                     <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                     </button>
                  </div>
               </div>
            </div>
         </motion.header>

         {/* Main Content */}
         <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
            <div className="w-full max-w-md">
               {/* Welcome Section */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden">
                     <img src={logoImage} alt="iLovePasswords Logo" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                  <p className="text-gray-600 dark:text-gray-400">Sign in to access your secure password vault</p>
               </motion.div>

               {/* Auth Form */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <AuthForm />
               </motion.div>

               {/* Security Notice */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
               >
                  <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                     <Lock className="w-4 h-4" />
                     <span className="text-sm font-medium">Your data is protected with end-to-end encryption</span>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Auth;
