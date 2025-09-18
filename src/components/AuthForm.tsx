import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const AuthForm: React.FC = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState("");

   const { signIn, signUp, signInWithGoogle } = useAuth();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setLoading(true);

      if (isSignUp && password !== confirmPassword) {
         setError("Passwords do not match");
         setLoading(false);
         return;
      }

      if (password.length < 6) {
         setError("Password must be at least 6 characters long");
         setLoading(false);
         return;
      }

      try {
         if (isSignUp) {
            await signUp(email, password);
            setSuccess("Account created successfully! Please check your email to verify your account.");
         } else {
            await signIn(email, password);
         }
      } catch (error: any) {
         setError(error.message || "An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const handleGoogleSignIn = async () => {
      setError("");
      setLoading(true);
      try {
         await signInWithGoogle();
      } catch (error: any) {
         setError(error.message || "Failed to sign in with Google");
         setLoading(false);
      }
   };

   const toggleMode = () => {
      setIsSignUp(!isSignUp);
      setError("");
      setSuccess("");
      setPassword("");
      setConfirmPassword("");
   };

   return (
      <div className="w-full max-w-md mx-auto">
         <Card className="shadow-lg">
            <CardHeader className="text-center">
               <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
               <CardDescription className="text-gray-600 dark:text-gray-300">
                  {isSignUp ? "Create an account to securely store your passwords" : "Sign in to access your password vault"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700"
                           required
                        />
                     </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                           type={showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700"
                           required
                        />
                        <motion.div className="absolute right-0 top-0 h-full flex items-center pr-1" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                           <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-10 w-10">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                        </motion.div>
                     </div>
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {isSignUp && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <div className="relative">
                           <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                           <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700"
                              required
                           />
                           <motion.div className="absolute right-0 top-0 h-full flex items-center pr-1" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button type="button" variant="ghost" size="icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="h-10 w-10">
                                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                           </motion.div>
                        </div>
                     </motion.div>
                  )}

                  {/* Error Message */}
                  {error && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
                     >
                        {error}
                     </motion.div>
                  )}

                  {/* Success Message */}
                  {success && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800"
                     >
                        {success}
                     </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                     type="submit"
                     className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                     size="lg"
                     disabled={loading}
                  >
                     {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                     </div>
                  </div>

                  {/* Google Sign In Button */}
                  <Button type="button" variant="outline" className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={handleGoogleSignIn} disabled={loading}>
                     <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                     </svg>
                     Continue with Google
                  </Button>

                  {/* Toggle Mode */}
                  <div className="text-center pt-2">
                     <button type="button" onClick={toggleMode} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
                        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                     </button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

export default AuthForm;
