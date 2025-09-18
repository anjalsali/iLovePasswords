import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Auth: React.FC = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
               <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Home
               </Link>
               <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                     <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">SecurePass</span>
               </div>
            </motion.div>

            {/* Auth Form */}
            <AuthForm />
         </div>
      </div>
   );
};

export default Auth;
