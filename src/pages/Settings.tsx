import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { User, Shield, Bell, Key, Trash2, Download, Moon, Sun, Eye, EyeOff } from "lucide-react";

const Settings: React.FC = () => {
   const { user } = useAuth();
   const { theme, toggleTheme } = useTheme();
   const [showMasterPassword, setShowMasterPassword] = useState(false);
   const [masterPassword, setMasterPassword] = useState("");
   const [newMasterPassword, setNewMasterPassword] = useState("");
   const [confirmMasterPassword, setConfirmMasterPassword] = useState("");
   const [notifications, setNotifications] = useState({
      email: true,
      security: true,
      updates: false,
   });

   const handleUpdateMasterPassword = () => {
      if (newMasterPassword === confirmMasterPassword && newMasterPassword.length >= 8) {
         // TODO: Implement master password update
         console.log("Updating master password");
         alert("Master password updated successfully!");
         setNewMasterPassword("");
         setConfirmMasterPassword("");
      } else {
         alert("Passwords don't match or are too short!");
      }
   };

   const handleExportData = () => {
      // TODO: Implement data export
      console.log("Exporting data");
      alert("Data export started! You'll receive an email when it's ready.");
   };

   const handleDeleteAccount = () => {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
         // TODO: Implement account deletion
         console.log("Deleting account");
         alert("Account deletion requested. You'll receive a confirmation email.");
      }
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
            {/* Header */}
            <motion.div variants={itemVariants}>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
               <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings</p>
            </motion.div>

            {/* Account Settings */}
            <motion.div variants={itemVariants}>
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span>Account Information</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <Input value={user?.email || ""} readOnly className="bg-gray-50 dark:bg-gray-800" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your email address cannot be changed</p>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Created</label>
                        <Input value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"} readOnly className="bg-gray-50 dark:bg-gray-800" />
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div variants={itemVariants}>
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>Security Settings</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     {/* Master Password */}
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Master Password</h3>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Master Password</label>
                           <div className="relative">
                              <Input
                                 type={showMasterPassword ? "text" : "password"}
                                 value={masterPassword}
                                 onChange={(e) => setMasterPassword(e.target.value)}
                                 placeholder="Enter current master password"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowMasterPassword(!showMasterPassword)}
                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                 {showMasterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Master Password</label>
                           <Input type="password" value={newMasterPassword} onChange={(e) => setNewMasterPassword(e.target.value)} placeholder="Enter new master password" />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Master Password</label>
                           <Input type="password" value={confirmMasterPassword} onChange={(e) => setConfirmMasterPassword(e.target.value)} placeholder="Confirm new master password" />
                        </div>

                        <Button onClick={handleUpdateMasterPassword} className="bg-green-600 hover:bg-green-700" disabled={!masterPassword || !newMasterPassword || !confirmMasterPassword}>
                           <Key className="w-4 h-4 mr-2" />
                           Update Master Password
                        </Button>
                     </div>

                     {/* Two-Factor Authentication */}
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                           <div>
                              <p className="font-medium text-yellow-800 dark:text-yellow-200">Two-Factor Authentication</p>
                              <p className="text-sm text-yellow-600 dark:text-yellow-300">Add an extra layer of security to your account</p>
                           </div>
                           <Button variant="outline" size="sm">
                              Enable 2FA
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div variants={itemVariants}>
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        {theme === "dark" ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-yellow-600" />}
                        <span>Appearance</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                           <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred color scheme</p>
                        </div>
                        <Button variant="outline" onClick={toggleTheme} className="flex items-center space-x-2">
                           {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                           <span>{theme === "dark" ? "Light" : "Dark"} Mode</span>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants}>
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        <span>Notifications</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {[
                        { key: "email", label: "Email Notifications", description: "Receive important updates via email" },
                        { key: "security", label: "Security Alerts", description: "Get notified about security events" },
                        { key: "updates", label: "Product Updates", description: "Stay informed about new features" },
                     ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between">
                           <div>
                              <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                 type="checkbox"
                                 checked={notifications[notification.key as keyof typeof notifications]}
                                 onChange={(e) =>
                                    setNotifications((prev) => ({
                                       ...prev,
                                       [notification.key]: e.target.checked,
                                    }))
                                 }
                                 className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                           </label>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div variants={itemVariants}>
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        <span>Data Management</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                           <p className="font-medium text-blue-800 dark:text-blue-200">Export Your Data</p>
                           <p className="text-sm text-blue-600 dark:text-blue-300">Download a copy of all your stored passwords</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportData}>
                           <Download className="w-4 h-4 mr-2" />
                           Export
                        </Button>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div>
                           <p className="font-medium text-red-800 dark:text-red-200">Delete Account</p>
                           <p className="text-sm text-red-600 dark:text-red-300">Permanently delete your account and all data</p>
                        </div>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={handleDeleteAccount}
                           className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Delete
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         </motion.div>
      </DashboardLayout>
   );
};

export default Settings;
