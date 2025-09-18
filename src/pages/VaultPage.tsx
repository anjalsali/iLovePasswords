import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Vault from "../components/Vault";
import { Link } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";

const VaultPage: React.FC = () => {
   const { user, signOut, loading } = useAuth();

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
               <p className="text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return <Navigate to="/auth" replace />;
   }

   const handleSignOut = async () => {
      try {
         await signOut();
      } catch (error) {
         console.error("Sign out error:", error);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
         {/* Header */}
         <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-4">
                     <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                           <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">SecurePass</span>
                     </Link>
                     <span className="text-gray-400">|</span>
                     <span className="text-gray-600">Password Vault</span>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className="text-sm text-gray-600">{user.email}</span>
                     <Button variant="outline" size="sm" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                     </Button>
                  </div>
               </div>
            </div>
         </header>

         {/* Vault Component */}
         <Vault />
      </div>
   );
};

export default VaultPage;
