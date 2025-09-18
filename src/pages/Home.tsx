import React from "react";
import PasswordGenerator from "../components/PasswordGenerator";
import TestTailwind from "../components/TestTailwind";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { Shield, Lock, Key, Zap, Moon, Sun, Sparkles, Database, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
   const { user, signOut } = useAuth();
   const { theme, toggleTheme } = useTheme();

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
         <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Secure Password Manager</div>
                     </div>
                  </motion.div>

                  <nav className="flex items-center space-x-4">
                     <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                     >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                     </motion.button>

                     {user ? (
                        <div className="flex items-center space-x-4">
                           <Link to="/vault">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                 <Button variant="outline" className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                    <Lock className="w-4 h-4 mr-2" />
                                    My Vault
                                 </Button>
                              </motion.div>
                           </Link>
                           <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                 <span className="text-xs font-bold text-white">{user.email?.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{user.email}</span>
                           </div>
                           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                 Sign Out
                              </Button>
                           </motion.div>
                        </div>
                     ) : (
                        <Link to="/auth">
                           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                                 <Key className="w-4 h-4 mr-2" />
                                 Sign In
                              </Button>
                           </motion.div>
                        </Link>
                     )}
                  </nav>
               </div>
            </div>
         </motion.header>

         {/* Hero Section */}
         <section className="relative overflow-hidden py-20 sm:py-32">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
            <motion.div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variants={containerVariants} initial="hidden" animate="visible">
               <motion.div variants={itemVariants}>
                  <motion.div
                     className="inline-flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 dark:border-gray-700/20"
                     whileHover={{ scale: 1.05 }}
                  >
                     <Sparkles className="w-4 h-4 text-purple-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trusted by 10,000+ users worldwide</span>
                  </motion.div>
               </motion.div>

               <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                  Generate <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Unbreakable</span> Passwords
               </motion.h1>

               <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Create military-grade passwords and store them with <span className="font-semibold text-blue-600 dark:text-blue-400">zero-knowledge encryption</span>. Your secrets stay yours,
                  always.
               </motion.p>

               <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  {!user ? (
                     <>
                        <Link to="/auth">
                           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl">
                                 <Key className="w-5 h-5 mr-2" />
                                 Start Securing Now
                                 <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                           </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                              <Sparkles className="w-5 h-5 mr-2" />
                              Try Generator
                           </Button>
                        </motion.div>
                     </>
                  ) : (
                     <Link to="/vault">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4 shadow-xl">
                              <Lock className="w-5 h-5 mr-2" />
                              Open Your Vault
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                        </motion.div>
                     </Link>
                  )}
               </motion.div>

               {/* Stats */}
               <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div className="text-center">
                     <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">256-bit</div>
                     <div className="text-gray-600 dark:text-gray-400">AES Encryption</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100K+</div>
                     <div className="text-gray-600 dark:text-gray-400">Passwords Generated</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">Zero</div>
                     <div className="text-gray-600 dark:text-gray-400">Data Breaches</div>
                  </div>
               </motion.div>
            </motion.div>
         </section>

         {/* Main Content */}
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Tailwind Test Component */}
            <div className="mb-8">
               <TestTailwind />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
               {/* Password Generator */}
               <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <PasswordGenerator />
               </motion.div>

               {/* Features */}
               <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-8">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Why Choose iLovePasswords?</h2>
                     <p className="text-gray-600 dark:text-gray-400">Built with security and privacy as our foundation</p>
                  </div>

                  <div className="space-y-6">
                     {[
                        {
                           icon: Shield,
                           title: "Military-Grade Encryption",
                           description: "AES-256-GCM encryption with PBKDF2 key derivation. Your data is encrypted locally before it ever leaves your device.",
                           color: "from-green-500 to-emerald-500",
                           bgColor: "bg-green-50 dark:bg-green-900/20",
                        },
                        {
                           icon: Zap,
                           title: "Lightning Fast Generation",
                           description: "Generate cryptographically secure passwords instantly with our advanced algorithm and customizable options.",
                           color: "from-blue-500 to-cyan-500",
                           bgColor: "bg-blue-50 dark:bg-blue-900/20",
                        },
                        {
                           icon: Database,
                           title: "Zero-Knowledge Architecture",
                           description: "We literally cannot see your passwords. Everything is encrypted client-side with your master password.",
                           color: "from-purple-500 to-pink-500",
                           bgColor: "bg-purple-50 dark:bg-purple-900/20",
                        },
                        {
                           icon: Users,
                           title: "Trusted by Thousands",
                           description: "Join over 10,000 security-conscious users who trust us with their digital safety.",
                           color: "from-orange-500 to-red-500",
                           bgColor: "bg-orange-50 dark:bg-orange-900/20",
                        },
                     ].map((feature, index) => (
                        <motion.div
                           key={feature.title}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                           whileHover={{ scale: 1.02, y: -2 }}
                        >
                           <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                              <CardContent className="p-6">
                                 <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                       <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                                    </div>
                                    <div className="flex-1">
                                       <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{feature.title}</h3>
                                       <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        </motion.div>
                     ))}
                  </div>

                  {!user && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }} whileHover={{ scale: 1.02 }}>
                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                           <CardHeader>
                              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready to secure your digital life?</CardTitle>
                              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                                 Join thousands of users who've made the smart choice. Start your secure journey today.
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <Link to="/auth">
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 shadow-lg">
                                       <Key className="w-5 h-5 mr-2" />
                                       Create Free Account
                                       <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                 </motion.div>
                              </Link>
                              <p className="text-xs text-center text-gray-500 dark:text-gray-400">No credit card required • Free forever • 2 minutes setup</p>
                           </CardContent>
                        </Card>
                     </motion.div>
                  )}
               </motion.div>
            </div>
         </main>

         {/* Footer */}
         <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 mt-20"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                     <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Built with ❤️ for security and privacy</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">&copy; 2024 iLovePasswords. Your security is our priority.</p>
               </div>
            </div>
         </motion.footer>
      </div>
   );
};

export default Home;
