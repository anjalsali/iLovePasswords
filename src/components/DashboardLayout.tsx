import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/Button";
import { Shield, Database, Settings, LogOut, Menu, X, Moon, Sun, Home, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
   children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const { user, signOut } = useAuth();
   const { theme, toggleTheme } = useTheme();
   const navigate = useNavigate();
   const location = useLocation();

   const handleSignOut = async () => {
      try {
         await signOut();
         navigate("/");
      } catch (error) {
         console.error("Sign out error:", error);
      }
   };

   const navigationItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Vault", href: "/vault", icon: Database },
      { name: "Settings", href: "/settings", icon: Settings },
   ];

   const isActive = (href: string) => location.pathname === href;

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
         {/* Mobile sidebar overlay */}
         <AnimatePresence>
            {sidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
               />
            )}
         </AnimatePresence>

         {/* Sidebar */}
         <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
               {/* Logo */}
               <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Dashboard</div>
                     </div>
                  </div>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4 space-y-2">
                  {navigationItems.map((item) => {
                     const Icon = item.icon;
                     return (
                        <motion.button
                           key={item.name}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => navigate(item.href)}
                           className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                              isActive(item.href)
                                 ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                           }`}
                        >
                           <Icon className="w-5 h-5" />
                           <span className="font-medium">{item.name}</span>
                        </motion.button>
                     );
                  })}
               </nav>

               {/* User section */}
               <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                     <LogOut className="w-4 h-4 mr-2" />
                     Sign Out
                  </Button>
               </div>
            </div>
         </div>

         {/* Mobile Sidebar */}
         <motion.div
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
         >
            <div className="flex flex-col h-full">
               {/* Logo */}
               <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Dashboard</div>
                     </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4 space-y-2">
                  {navigationItems.map((item) => {
                     const Icon = item.icon;
                     return (
                        <motion.button
                           key={item.name}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => {
                              navigate(item.href);
                              setSidebarOpen(false);
                           }}
                           className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                              isActive(item.href)
                                 ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                           }`}
                        >
                           <Icon className="w-5 h-5" />
                           <span className="font-medium">{item.name}</span>
                        </motion.button>
                     );
                  })}
               </nav>

               {/* User section */}
               <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                     <LogOut className="w-4 h-4 mr-2" />
                     Sign Out
                  </Button>
               </div>
            </div>
         </motion.div>

         {/* Main content */}
         <div className="flex-1 flex flex-col min-w-0">
            {/* Top navbar */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
               <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                     <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                           <Menu className="w-5 h-5" />
                        </button>
                        <div className="ml-4 lg:ml-0">
                           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{navigationItems.find((item) => isActive(item.href))?.name || "Dashboard"}</h1>
                        </div>
                     </div>

                     <div className="flex items-center space-x-4">
                        <button
                           onClick={toggleTheme}
                           className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                           {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center space-x-2">
                           <Lock className="w-4 h-4 text-green-500" />
                           <span className="text-sm text-gray-600 dark:text-gray-400">Secure</span>
                        </div>
                     </div>
                  </div>
               </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-none">
                  {children}
               </motion.div>
            </main>
         </div>
      </div>
   );
};

export default DashboardLayout;
