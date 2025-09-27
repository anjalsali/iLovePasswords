import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import PasswordGeneratorCard from "../components/PasswordGeneratorCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { Shield, Key, Database, TrendingUp, Clock, Eye, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DashboardStats, CreateVaultEntryData } from "../types";

const Dashboard: React.FC = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [stats, setStats] = useState<DashboardStats>({
      totalPasswords: 0,
      recentActivity: 0,
      categoriesCount: {
         "Social Media": 0,
         Email: 0,
         Work: 0,
         Banking: 0,
         Shopping: 0,
         Entertainment: 0,
         Utilities: 0,
         Other: 0,
      },
   });

   // Mock data for now - in real app, this would come from Supabase
   useEffect(() => {
      // Simulate loading stats
      setStats({
         totalPasswords: 12,
         recentActivity: 3,
         categoriesCount: {
            "Social Media": 4,
            Email: 2,
            Work: 3,
            Banking: 1,
            Shopping: 2,
            Entertainment: 0,
            Utilities: 0,
            Other: 0,
         },
      });
   }, []);

   const handleSavePassword = (data: CreateVaultEntryData) => {
      // TODO: Implement save to vault functionality
      console.log("Saving password:", data);
      // For now, just show a success message
      alert("Password saved to vault!");
   };

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            duration: 0.5,
         },
      },
   };

   return (
      <DashboardLayout>
         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Welcome Section */}
            <motion.div
               variants={itemVariants}
               className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
            >
               <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                     <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user?.email?.split("@")[0]}! 👋</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Your digital security dashboard is ready</p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                     <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>All systems secure</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>End-to-end encrypted</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Passwords</p>
                           <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalPasswords}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Securely stored</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                           <Database className="w-8 h-8 text-white" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Recent Activity</p>
                           <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.recentActivity}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                           <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Security Score</p>
                           <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">98%</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Excellent</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                           <Shield className="w-8 h-8 text-white" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Password Generator */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Generator</h2>
                     <Button variant="outline" size="sm" onClick={() => navigate("/vault")}>
                        <Key className="w-4 h-4 mr-2" />
                        View Vault
                     </Button>
                  </div>
                  <PasswordGeneratorCard onSavePassword={handleSavePassword} />
               </div>

               {/* Recent Activity */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                     <Button variant="outline" size="sm" onClick={() => navigate("/vault")}>
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                     </Button>
                  </div>
                  <Card>
                     <CardContent className="p-6">
                        <div className="space-y-4">
                           {[
                              { action: "Generated password for", site: "GitHub", time: "2 hours ago" },
                              { action: "Updated password for", site: "Netflix", time: "1 day ago" },
                              { action: "Added new entry for", site: "Bank of America", time: "3 days ago" },
                           ].map((activity, index) => (
                              <motion.div
                                 key={index}
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: index * 0.1 }}
                                 className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                 <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                       {activity.action} <span className="font-semibold">{activity.site}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </motion.div>

            {/* Category Overview */}
            <motion.div variants={itemVariants}>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Password Categories</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {Object.entries(stats.categoriesCount).map(([category, count]) => (
                     <motion.div
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate("/vault")}
                     >
                        <div className="text-2xl mb-2">
                           {category === "Social Media"
                              ? "📱"
                              : category === "Email"
                              ? "📧"
                              : category === "Work"
                              ? "💼"
                              : category === "Banking"
                              ? "🏦"
                              : category === "Shopping"
                              ? "🛒"
                              : category === "Entertainment"
                              ? "🎬"
                              : category === "Utilities"
                              ? "⚡"
                              : "📁"}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{count}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{category}</p>
                     </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Security Tips */}
            <motion.div variants={itemVariants}>
               <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
                        <Lock className="w-5 h-5" />
                        <span>Security Tip</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-blue-800 dark:text-blue-200">
                        💡 <strong>Pro Tip:</strong> Use unique passwords for each account and enable two-factor authentication whenever possible. Your password manager makes it easy to maintain
                        strong security across all your accounts.
                     </p>
                  </CardContent>
               </Card>
            </motion.div>
         </motion.div>
      </DashboardLayout>
   );
};

export default Dashboard;
