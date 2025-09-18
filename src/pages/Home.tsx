import React from "react";
import PasswordGenerator from "../components/PasswordGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Shield, Lock, Key, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
   const { user } = useAuth();

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
         {/* Header */}
         <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-bold text-gray-900">SecurePass</span>
                  </div>
                  <nav className="flex items-center space-x-4">
                     {user ? (
                        <>
                           <Link to="/vault">
                              <Button variant="outline">
                                 <Lock className="w-4 h-4 mr-2" />
                                 My Vault
                              </Button>
                           </Link>
                           <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                        </>
                     ) : (
                        <Link to="/auth">
                           <Button>
                              <Key className="w-4 h-4 mr-2" />
                              Sign In
                           </Button>
                        </Link>
                     )}
                  </nav>
               </div>
            </div>
         </header>

         {/* Main Content */}
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                     Generate <span className="text-primary">Secure</span> Passwords
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Create strong, unique passwords and store them securely with client-side encryption. Your passwords never leave your device unencrypted.</p>
               </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
               {/* Password Generator */}
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <PasswordGenerator />
               </motion.div>

               {/* Features */}
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-6">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose SecurePass?</h2>
                  </div>

                  <div className="space-y-4">
                     <Card>
                        <CardContent className="p-4">
                           <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                 <Shield className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-900">Client-Side Encryption</h3>
                                 <p className="text-sm text-gray-600">Your passwords are encrypted locally before being stored. We never see your data in plain text.</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardContent className="p-4">
                           <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                 <Zap className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-900">Instant Generation</h3>
                                 <p className="text-sm text-gray-600">Generate strong passwords instantly with customizable length and character sets.</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardContent className="p-4">
                           <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                 <Lock className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-900">Secure Storage</h3>
                                 <p className="text-sm text-gray-600">Store your passwords securely with AES-GCM encryption and PBKDF2 key derivation.</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {!user && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
                        <Card className="bg-primary/5 border-primary/20">
                           <CardHeader>
                              <CardTitle className="text-primary">Ready to secure your passwords?</CardTitle>
                              <CardDescription>Create an account to start using the password vault and store your passwords securely.</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <Link to="/auth">
                                 <Button size="lg" className="w-full">
                                    <Key className="w-4 h-4 mr-2" />
                                    Get Started Free
                                 </Button>
                              </Link>
                           </CardContent>
                        </Card>
                     </motion.div>
                  )}
               </motion.div>
            </div>
         </main>

         {/* Footer */}
         <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center text-gray-600">
                  <p>&copy; 2024 SecurePass. Built with security and privacy in mind.</p>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default Home;
