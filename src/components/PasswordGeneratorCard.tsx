import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { generatePassword, calculatePasswordStrength, copyToClipboard } from "../lib/utils";
import { Copy, RefreshCw, Eye, EyeOff, Check, Key, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VaultCategory } from "../types";

interface PasswordGeneratorCardProps {
   onSavePassword?: (data: { title: string; username?: string; url?: string; category: VaultCategory; password: string }) => void;
}

const PasswordGeneratorCard: React.FC<PasswordGeneratorCardProps> = ({ onSavePassword }) => {
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
   const [showSaveForm, setShowSaveForm] = useState(false);
   const [saveData, setSaveData] = useState({
      title: "",
      username: "",
      url: "",
      category: "Other" as VaultCategory,
   });

   const handleGeneratePassword = useCallback(async () => {
      setIsGenerating(true);
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

   const handleSavePassword = () => {
      if (onSavePassword && password && saveData.title) {
         onSavePassword({
            ...saveData,
            password,
         });
         setShowSaveForm(false);
         setSaveData({ title: "", username: "", url: "", category: "Other" });
      }
   };

   const strength = calculatePasswordStrength(password);

   // Generate initial password on mount
   React.useEffect(() => {
      handleGeneratePassword();
   }, [handleGeneratePassword]);

   return (
      <Card className="w-full max-w-2xl mx-auto">
         <CardHeader>
            <CardTitle className="flex items-center space-x-2">
               <Key className="w-5 h-5 text-blue-600" />
               <span>Password Generator</span>
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            {/* Password Display */}
            <div className="space-y-3">
               <div className="relative">
                  <Input
                     type={showPassword ? "text" : "password"}
                     value={password}
                     readOnly
                     className="pr-20 font-mono text-center border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-900"
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

               {/* Strength Meter */}
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-600 dark:text-gray-400">Strength:</span>
                     <span className={`font-semibold ${strength.score < 3 ? "text-red-500" : strength.score < 6 ? "text-yellow-500" : "text-green-500"}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength.score / 9) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-2 rounded-full ${strength.score < 3 ? "bg-red-500" : strength.score < 6 ? "bg-yellow-500" : "bg-green-500"}`}
                     />
                  </div>
               </div>
            </div>

            {/* Length Slider */}
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Length: {options.length}</label>
               </div>
               <input
                  type="range"
                  min="8"
                  max="64"
                  value={options.length}
                  onChange={(e) => handleOptionChange("length", parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-lg appearance-none cursor-pointer slider"
               />
            </div>

            {/* Character Options */}
            <div className="space-y-3">
               <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Character Types</label>
               <div className="grid grid-cols-2 gap-2">
                  {[
                     { key: "includeUppercase", label: "Uppercase (A-Z)" },
                     { key: "includeLowercase", label: "Lowercase (a-z)" },
                     { key: "includeNumbers", label: "Numbers (0-9)" },
                     { key: "includeSymbols", label: "Symbols (!@#)" },
                  ].map((option) => (
                     <label
                        key={option.key}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                     >
                        <input
                           type="checkbox"
                           checked={options[option.key as keyof typeof options] as boolean}
                           onChange={(e) => handleOptionChange(option.key as keyof typeof options, e.target.checked)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                     </label>
                  ))}
               </div>
            </div>

            {/* Generate Button */}
            <Button
               onClick={handleGeneratePassword}
               className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                        <span>Generate Password</span>
                     </motion.div>
                  )}
               </AnimatePresence>
            </Button>

            {/* Save to Vault */}
            {onSavePassword && password && (
               <div className="space-y-3">
                  {!showSaveForm ? (
                     <Button variant="outline" onClick={() => setShowSaveForm(true)} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save to Vault
                     </Button>
                  ) : (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
                     >
                        <Input placeholder="Site/App name (required)" value={saveData.title} onChange={(e) => setSaveData((prev) => ({ ...prev, title: e.target.value }))} />
                        <Input placeholder="Username/Email (optional)" value={saveData.username} onChange={(e) => setSaveData((prev) => ({ ...prev, username: e.target.value }))} />
                        <Input placeholder="URL (optional)" value={saveData.url} onChange={(e) => setSaveData((prev) => ({ ...prev, url: e.target.value }))} />
                        <select
                           value={saveData.category}
                           onChange={(e) => setSaveData((prev) => ({ ...prev, category: e.target.value as VaultCategory }))}
                           className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        >
                           <option value="Other">Other</option>
                           <option value="Social Media">Social Media</option>
                           <option value="Email">Email</option>
                           <option value="Work">Work</option>
                           <option value="Banking">Banking</option>
                           <option value="Shopping">Shopping</option>
                           <option value="Entertainment">Entertainment</option>
                           <option value="Utilities">Utilities</option>
                        </select>
                        <div className="flex space-x-2">
                           <Button onClick={handleSavePassword} disabled={!saveData.title} className="flex-1 bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                           </Button>
                           <Button variant="outline" onClick={() => setShowSaveForm(false)} className="flex-1">
                              Cancel
                           </Button>
                        </div>
                     </motion.div>
                  )}
               </div>
            )}

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
         </CardContent>
      </Card>
   );
};

export default PasswordGeneratorCard;
