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

   const { signIn, signUp } = useAuth();

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

   const toggleMode = () => {
      setIsSignUp(!isSignUp);
      setError("");
      setSuccess("");
      setPassword("");
      setConfirmPassword("");
   };

   return (
      <div className="w-full max-w-md mx-auto">
         <Card>
            <CardHeader>
               <CardTitle className="text-center">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
               <CardDescription className="text-center">{isSignUp ? "Create an account to securely store your passwords" : "Sign in to access your password vault"}</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                     </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                           type={showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="pl-10 pr-10"
                           required
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-10 w-10">
                           {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                     </div>
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {isSignUp && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10 pr-10"
                              required
                           />
                           <Button type="button" variant="ghost" size="icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-0 h-10 w-10">
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                        </div>
                     </motion.div>
                  )}

                  {/* Error Message */}
                  {error && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {error}
                     </motion.div>
                  )}

                  {/* Success Message */}
                  {success && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                        {success}
                     </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                     {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                  </Button>

                  {/* Toggle Mode */}
                  <div className="text-center">
                     <button type="button" onClick={toggleMode} className="text-sm text-blue-600 hover:underline">
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
