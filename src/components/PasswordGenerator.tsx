import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { generatePassword, calculatePasswordStrength, copyToClipboard } from "../lib/utils";
import { Copy, RefreshCw, Eye, EyeOff, Check, Sparkles, Settings } from "lucide-react";
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
   const [showAdvanced, setShowAdvanced] = useState(false);

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
      <div className="w-full max-w-2xl mx-auto">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
               <CardHeader className="text-center pb-4">
                  <motion.div
                     className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
                     whileHover={{ scale: 1.05, rotate: 5 }}
                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                     <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Password Generator</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Create unbreakable passwords with military-grade security</CardDescription>
               </CardHeader>

               <CardContent className="space-y-8">
                  {/* Password Display */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Password</label>
                        <motion.button
                           onClick={() => setShowAdvanced(!showAdvanced)}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                           <Settings className="w-3 h-3" />
                           <span>{showAdvanced ? "Hide" : "Show"} Advanced</span>
                        </motion.button>
                     </div>

                     <div className="relative group">
                        <Input
                           type={showPassword ? "text" : "password"}
                           value={password}
                           readOnly
                           className="pr-24 font-mono text-lg h-14 text-center border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700"
                           placeholder="Click generate to create password"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="h-10 w-10 hover:bg-gray-200 dark:hover:bg-gray-600">
                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                           </motion.div>

                           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button type="button" variant="ghost" size="icon" onClick={handleCopyPassword} className="h-10 w-10 hover:bg-gray-200 dark:hover:bg-gray-600" disabled={!password}>
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
                           </motion.div>
                        </div>
                     </div>
                  </div>

                  {/* Strength Meter */}
                  <AnimatePresence>
                     {password && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password Strength</span>
                              <motion.span
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 className={`text-sm font-bold px-3 py-1 rounded-full ${
                                    strength.score <= 2
                                       ? "text-red-600 bg-red-100 dark:bg-red-900/20"
                                       : strength.score <= 4
                                       ? "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
                                       : strength.score <= 6
                                       ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                                       : strength.score <= 8
                                       ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                                       : "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20"
                                 }`}
                              >
                                 {strength.label}
                              </motion.span>
                           </div>
                           <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(strength.score / 9) * 100}%` }}
                                 transition={{ duration: 0.8, ease: "easeOut" }}
                                 className={`h-3 rounded-full bg-gradient-to-r ${
                                    strength.score <= 2
                                       ? "from-red-400 to-red-600"
                                       : strength.score <= 4
                                       ? "from-orange-400 to-orange-600"
                                       : strength.score <= 6
                                       ? "from-yellow-400 to-yellow-600"
                                       : strength.score <= 8
                                       ? "from-green-400 to-green-600"
                                       : "from-emerald-400 to-emerald-600"
                                 }`}
                              />
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* Length Slider */}
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password Length</label>
                        <motion.span
                           key={options.length}
                           initial={{ scale: 1.2 }}
                           animate={{ scale: 1 }}
                           className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg"
                        >
                           {options.length}
                        </motion.span>
                     </div>
                     <div className="px-2">
                        <input
                           type="range"
                           min="8"
                           max="128"
                           value={options.length}
                           onChange={(e) => handleOptionChange("length", parseInt(e.target.value))}
                           className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-lg appearance-none cursor-pointer slider"
                           style={{
                              background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(147 51 234) ${((options.length - 8) / (128 - 8)) * 100}%, rgb(229 231 235) ${
                                 ((options.length - 8) / (128 - 8)) * 100
                              }%, rgb(229 231 235) 100%)`,
                           }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                           <span>8</span>
                           <span>128</span>
                        </div>
                     </div>
                  </div>

                  {/* Character Type Options */}
                  <div className="space-y-4">
                     <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Character Types</label>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                           { key: "includeUppercase", label: "Uppercase", example: "A-Z", color: "from-blue-500 to-blue-600" },
                           { key: "includeLowercase", label: "Lowercase", example: "a-z", color: "from-green-500 to-green-600" },
                           { key: "includeNumbers", label: "Numbers", example: "0-9", color: "from-purple-500 to-purple-600" },
                           { key: "includeSymbols", label: "Symbols", example: "!@#$", color: "from-orange-500 to-orange-600" },
                        ].map((option) => (
                           <motion.label
                              key={option.key}
                              className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <input
                                 type="checkbox"
                                 checked={options[option.key as keyof typeof options] as boolean}
                                 onChange={(e) => handleOptionChange(option.key as keyof typeof options, e.target.checked)}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <div className="flex-1">
                                 <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                                 <div className={`text-xs bg-gradient-to-r ${option.color} bg-clip-text text-transparent font-mono`}>{option.example}</div>
                              </div>
                           </motion.label>
                        ))}
                     </div>
                  </div>

                  {/* Advanced Options */}
                  <AnimatePresence>
                     {showAdvanced && (
                        <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-6"
                        >
                           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Advanced Options</h3>
                           <motion.label
                              className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer"
                              whileHover={{ scale: 1.01 }}
                           >
                              <div>
                                 <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Ensure Each Type</div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">Guarantee at least one character from each selected type</div>
                              </div>
                              <input
                                 type="checkbox"
                                 checked={options.ensureEachType}
                                 onChange={(e) => handleOptionChange("ensureEachType", e.target.checked)}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                           </motion.label>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* Generate Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                     <Button
                        onClick={handleGeneratePassword}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        size="lg"
                        disabled={(!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols) || isGenerating}
                     >
                        <AnimatePresence mode="wait">
                           {isGenerating ? (
                              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-2">
                                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                    <RefreshCw className="w-5 h-5" />
                                 </motion.div>
                                 <span>Generating...</span>
                              </motion.div>
                           ) : (
                              <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-2">
                                 <Sparkles className="w-5 h-5" />
                                 <span>Generate Secure Password</span>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </Button>
                  </motion.div>

                  {/* Copy Feedback */}
                  <AnimatePresence>
                     {copied && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.8 }} className="text-center">
                           <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                              <Check className="w-4 h-4" />
                              <span>Password copied to clipboard!</span>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </CardContent>
            </Card>
         </motion.div>
      </div>
   );
};

export default PasswordGenerator;
