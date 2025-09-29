import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Moon, Sun, Lock, Key, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import logoImage from "../assets/ilovepasswordslogo.png";

interface NavbarProps {
   showBackButton?: boolean;
   backTo?: string;
   backText?: string;
}

const Navbar: React.FC<NavbarProps> = ({ showBackButton = true, backTo = "/", backText = "Back to Home" }) => {
   const { theme, toggleTheme } = useTheme();
   const { user, signOut } = useAuth();
   const location = useLocation();

   // Determine if we should show auth-related nav items
   const isAuthPage = location.pathname === "/auth" || location.pathname === "/signup";
   const isLandingPage = location.pathname === "/";

   const handleSignOut = async () => {
      try {
         await signOut();
      } catch (error) {
         console.error("Error signing out:", error);
      }
   };

   return (
      <motion.header
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.6 }}
         className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
               {/* Logo and App Name */}
               <div className="flex items-center space-x-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                     <img src={logoImage} alt="iLovePasswords Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                     <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">iLovePasswords</span>
                  </div>
               </div>

               {/* Navigation Items */}
               <div className="flex items-center space-x-4">
                  {/* Back Button - only show on auth pages */}
                  {isAuthPage && showBackButton && (
                     <Link
                        to={backTo}
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                     >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {backText}
                     </Link>
                  )}

                  {/* Auth Links - only show on landing page */}
                  {isLandingPage && (
                     <>
                        {user ? (
                           <div className="flex items-center space-x-4">
                              <Link to="/dashboard">
                                 <Button variant="outline">
                                    <Key className="w-4 h-4 mr-2" />
                                    Dashboard
                                 </Button>
                              </Link>
                              <div className="flex items-center space-x-2">
                                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{user.email?.charAt(0).toUpperCase()}</span>
                                 </div>
                                 <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{user.email}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                 Sign Out
                              </Button>
                           </div>
                        ) : (
                           <div className="flex items-center space-x-3">
                              <Link to="/auth">
                                 <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                                    <User className="w-4 h-4 mr-2" />
                                    Sign In
                                 </Button>
                              </Link>
                              <Link to="/signup">
                                 <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Sign Up
                                 </Button>
                              </Link>
                           </div>
                        )}
                     </>
                  )}

                  {/* Security Indicator - show on auth pages */}
                  {isAuthPage && (
                     <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Secure</span>
                     </div>
                  )}

                  {/* Theme Toggle - show on all pages */}
                  <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                     {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
               </div>
            </div>
         </div>
      </motion.header>
   );
};

export default Navbar;
