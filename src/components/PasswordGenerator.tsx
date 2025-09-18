import React, { useState, useCallback } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { generatePassword, calculatePasswordStrength, copyToClipboard } from "../lib/utils";
import { Copy, RefreshCw, Eye, EyeOff, Check, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PasswordGenerator: React.FC = () => {
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(true);
   const [options, setOptions] = useState({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      ensureEachType: true,
   });
   const [copied, setCopied] = useState(false);
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGeneratePassword = useCallback(async () => {
      setIsGenerating(true);
      // Add a small delay for animation
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newPassword = generatePassword(options.length, options.includeUppercase, options.includeLowercase, options.includeNumbers, options.includeSymbols, options.ensureEachType || false);
      setPassword(newPassword);
      setIsGenerating(false);
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
      <div className="w-full max-w-6xl mx-auto h-[85vh] flex items-center">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
            <Card className="shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
               <div className="grid lg:grid-cols-5 gap-0 h-full min-h-[500px]">
                  {/* Left Section - Header & Stats */}
                  <div className="lg:col-span-2 bg-blue-600 dark:bg-gray-700 p-8 flex flex-col justify-center text-white dark:text-gray-100">
                     <div className="text-center space-y-6">
                        <div className="mx-auto w-20 h-20 bg-white/20 dark:bg-gray-600 rounded-2xl flex items-center justify-center">
                           <Key className="w-10 h-10 text-white dark:text-gray-200" />
                        </div>
                        <div>
                           <h1 className="text-3xl font-bold mb-3">Security Forge</h1>
                           <p className="text-blue-100 dark:text-gray-300 text-lg leading-relaxed">Craft unbreakable passwords with military precision</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4 pt-4">
                           <div className="flex items-center justify-between text-sm bg-white/10 dark:bg-gray-600/50 rounded-lg p-3">
                              <span className="text-blue-200 dark:text-gray-300">Strength:</span>
                              <span className="font-semibold">{strength.label}</span>
                           </div>
                           <div className="flex items-center justify-between text-sm bg-white/10 dark:bg-gray-600/50 rounded-lg p-3">
                              <span className="text-blue-200 dark:text-gray-300">Length:</span>
                              <span className="font-semibold">{options.length} chars</span>
                           </div>
                           <div className="w-full bg-white/20 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(strength.score / 9) * 100}%` }}
                                 transition={{ duration: 0.8, ease: "easeOut" }}
                                 className="h-2 rounded-full bg-white dark:bg-blue-400"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Section - Controls */}
                  <div className="lg:col-span-3 p-8">
                     <div className="h-full flex flex-col justify-between space-y-6">
                        {/* Password Display */}
                        <div className="space-y-4">
                           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Password</h2>
                           <div className="relative group">
                              <Input
                                 type={showPassword ? "text" : "password"}
                                 value={password}
                                 readOnly
                                 className="pr-20 font-mono text-base h-12 text-center border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-900"
                                 placeholder="Click generate to create password"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                                 <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-8 w-8">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                 </Button>
                                 <Button type="button" variant="ghost" size="icon" onClick={handleCopyPassword} className="h-8 w-8" disabled={!password}>
                                    <AnimatePresence mode="wait">
                                       {copied ? (
                                          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                             <Check className="h-4 w-4 text-green-500" />
                                          </motion.div>
                                       ) : (
                                          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                             <Copy className="h-4 w-4" />
                                          </motion.div>
                                       )}
                                    </AnimatePresence>
                                 </Button>
                              </div>
                           </div>
                        </div>

                        {/* Length Slider */}
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password Length</label>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">{options.length}</span>
                           </div>
                           <input
                              type="range"
                              min="8"
                              max="128"
                              value={options.length}
                              onChange={(e) => handleOptionChange("length", parseInt(e.target.value))}
                              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-lg appearance-none cursor-pointer slider"
                           />
                           <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>8</span>
                              <span>128</span>
                           </div>
                        </div>

                        {/* Character Type Options */}
                        <div className="space-y-3">
                           <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Character Types</label>
                           <div className="grid grid-cols-2 gap-3">
                              {[
                                 { key: "includeUppercase", label: "Uppercase", example: "A-Z" },
                                 { key: "includeLowercase", label: "Lowercase", example: "a-z" },
                                 { key: "includeNumbers", label: "Numbers", example: "0-9" },
                                 { key: "includeSymbols", label: "Symbols", example: "!@#" },
                              ].map((option) => (
                                 <label
                                    key={option.key}
                                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                                 >
                                    <input
                                       type="checkbox"
                                       checked={options[option.key as keyof typeof options] as boolean}
                                       onChange={(e) => handleOptionChange(option.key as keyof typeof options, e.target.checked)}
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                       <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                                       <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{option.example}</div>
                                    </div>
                                 </label>
                              ))}
                           </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="space-y-3">
                           <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                 type="checkbox"
                                 checked={options.ensureEachType}
                                 onChange={(e) => handleOptionChange("ensureEachType", e.target.checked)}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Ensure each character type</span>
                           </label>
                        </div>

                        {/* Generate Button */}
                        <div className="space-y-3">
                           <Button
                              onClick={handleGeneratePassword}
                              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg"
                              size="lg"
                              disabled={(!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols) || isGenerating}
                           >
                              <AnimatePresence mode="wait">
                                 {isGenerating ? (
                                    <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-2">
                                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                          <RefreshCw className="w-4 h-4" />
                                       </motion.div>
                                       <span>Generating...</span>
                                    </motion.div>
                                 ) : (
                                    <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-2">
                                       <Key className="w-4 h-4" />
                                       <span>Forge Security</span>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </Button>

                           {/* Copy Feedback */}
                           <AnimatePresence>
                              {copied && (
                                 <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.8 }} className="text-center">
                                    <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-full text-sm font-medium">
                                       <Check className="w-4 h-4" />
                                       <span>Password copied!</span>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>
         </motion.div>
      </div>
   );
};

export default PasswordGenerator;
