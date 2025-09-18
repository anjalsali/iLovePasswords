import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { generatePassword, calculatePasswordStrength, copyToClipboard } from "../lib/utils";
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const PasswordGenerator: React.FC = () => {
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(true);
   const [options, setOptions] = useState({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
   });
   const [copied, setCopied] = useState(false);

   const handleGeneratePassword = useCallback(() => {
      const newPassword = generatePassword(options.length, options.includeUppercase, options.includeLowercase, options.includeNumbers, options.includeSymbols);
      setPassword(newPassword);
   }, [options]);

   const handleCopyPassword = async () => {
      if (password && (await copyToClipboard(password))) {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
   };

   const handleOptionChange = (option: keyof typeof options, value: boolean | number) => {
      setOptions((prev) => ({ ...prev, [option]: value }));
   };

   const strength = calculatePasswordStrength(password);

   // Generate initial password on mount
   React.useEffect(() => {
      handleGeneratePassword();
   }, [handleGeneratePassword]);

   return (
      <div className="w-full max-w-2xl mx-auto">
         <Card>
            <CardHeader>
               <CardTitle className="text-center">Password Generator</CardTitle>
               <CardDescription className="text-center">Generate secure passwords with customizable options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               {/* Password Display */}
               <div className="space-y-2">
                  <label className="text-sm font-medium">Generated Password</label>
                  <div className="relative">
                     <Input type={showPassword ? "text" : "password"} value={password} readOnly className="pr-20 font-mono text-lg" placeholder="Click generate to create password" />
                     <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-8 w-8">
                           {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={handleCopyPassword} className="h-8 w-8" disabled={!password}>
                           <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Strength Meter */}
               {password && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Password Strength</span>
                        <span
                           className={`text-sm font-semibold ${
                              strength.score <= 2
                                 ? "text-red-500"
                                 : strength.score <= 4
                                 ? "text-orange-500"
                                 : strength.score <= 6
                                 ? "text-yellow-500"
                                 : strength.score <= 8
                                 ? "text-green-500"
                                 : "text-emerald-500"
                           }`}
                        >
                           {strength.label}
                        </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(strength.score / 9) * 100}%` }} transition={{ duration: 0.3 }} className={`h-2 rounded-full ${strength.color}`} />
                     </div>
                  </motion.div>
               )}

               {/* Length Slider */}
               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <label className="text-sm font-medium">Length</label>
                     <span className="text-sm text-muted-foreground">{options.length}</span>
                  </div>
                  <input
                     type="range"
                     min="8"
                     max="64"
                     value={options.length}
                     onChange={(e) => handleOptionChange("length", parseInt(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
               </div>

               {/* Character Type Options */}
               <div className="space-y-3">
                  <label className="text-sm font-medium">Character Types</label>
                  <div className="grid grid-cols-2 gap-3">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={options.includeUppercase} onChange={(e) => handleOptionChange("includeUppercase", e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Uppercase (A-Z)</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={options.includeLowercase} onChange={(e) => handleOptionChange("includeLowercase", e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Lowercase (a-z)</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={options.includeNumbers} onChange={(e) => handleOptionChange("includeNumbers", e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Numbers (0-9)</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={options.includeSymbols} onChange={(e) => handleOptionChange("includeSymbols", e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Symbols (!@#$%)</span>
                     </label>
                  </div>
               </div>

               {/* Generate Button */}
               <Button
                  onClick={handleGeneratePassword}
                  className="w-full"
                  size="lg"
                  disabled={!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols}
               >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Password
               </Button>

               {copied && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm text-green-600 font-medium">
                     Password copied to clipboard!
                  </motion.div>
               )}
            </CardContent>
         </Card>
      </div>
   );
};

export default PasswordGenerator;
