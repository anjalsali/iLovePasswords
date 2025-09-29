import React from "react";
import AuthForm from "../components/AuthForm";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import logoImage from "../assets/ilovepasswordslogo.png";

const Signup: React.FC = () => {
   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         {/* Navbar */}
         <Navbar />

         {/* Main Content */}
         <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
            <div className="w-full max-w-md">
               {/* Welcome Section */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                     <img src={logoImage} alt="iLovePasswords Logo" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                  <p className="text-gray-600 dark:text-gray-400">Join us to secure your digital life with our password manager</p>
               </motion.div>

               {/* Auth Form */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <AuthForm defaultMode="signup" />
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

               {/* Sign In Link */}
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     Already have an account?{" "}
                     <Link to="/auth" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
                        Sign in here
                     </Link>
                  </p>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Signup;
