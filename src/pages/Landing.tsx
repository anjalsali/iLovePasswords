import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { Shield, Key, Zap, Database, ArrowRight, Github, User, UserPlus } from "lucide-react";
import PasswordGeneratorCard from "../components/PasswordGeneratorCard";
import logoImage from "../assets/ilovepasswordslogo.png";

const Landing: React.FC = () => {
   const { user } = useAuth();
   const { scrollYProgress } = useScroll();

   // Parallax effects for hero section
   const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
   const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.15,
         },
      },
   };

   const itemVariants = {
      hidden: { y: 30, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            duration: 0.6,
         },
      },
   };

   const scrollVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            duration: 0.8,
         },
      },
   };

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         {/* Navbar */}
         <Navbar />

         {/* Hero Section */}
         <section className="relative min-h-screen flex items-center justify-center">
            <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ y: heroY, opacity: heroOpacity }} variants={containerVariants} initial="hidden" animate="visible">
               <motion.div variants={itemVariants}></motion.div>

               <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Fortify</span> Your Digital Life
               </motion.h1>

               <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Where security meets simplicity. Create unbreakable passwords and guard your digital identity with{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">military-grade protection</span>.
               </motion.p>

               <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  {!user ? (
                     <>
                        <Link to="/auth">
                           <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-lg px-8 py-4 shadow-lg">
                              <User className="w-5 h-5 mr-2" />
                              Sign In
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                        </Link>
                        <Link to="/signup">
                           <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg px-8 py-4 shadow-lg">
                              <UserPlus className="w-5 h-5 mr-2" />
                              Sign Up
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                        </Link>
                        <a href="#generator">
                           <Button size="lg" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-lg px-8 py-4 shadow-lg">
                              <Key className="w-5 h-5 mr-2" />
                              Try Generator
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                        </a>
                     </>
                  ) : (
                     <Link to="/dashboard">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-lg px-8 py-4 shadow-lg">
                           <Key className="w-5 h-5 mr-2" />
                           Access Dashboard
                           <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                     </Link>
                  )}
               </motion.div>

               {/* Stats */}
               <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                     <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">AES-256</div>
                     <div className="text-gray-600 dark:text-gray-400">Encryption</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Client-Side</div>
                     <div className="text-gray-600 dark:text-gray-400">Processing</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Open Source</div>
                     <div className="text-gray-600 dark:text-gray-400">& Transparent</div>
                  </div>
               </motion.div>
            </motion.div>
         </section>

         {/* Password Generator Section */}
         <section className="min-h-screen flex items-center justify-center py-16" id="generator">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
               <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }}>
                  <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Try Our Password Generator</h2>
                     <p className="text-gray-600 dark:text-gray-400">Generate secure passwords instantly with our advanced tool</p>
                  </div>
                  <PasswordGeneratorCard />
               </motion.div>
            </div>
         </section>

         {/* Features Section */}
         <section className="min-h-screen flex items-center justify-center py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
               <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why use this tool?</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">Simple, secure, and privacy-focused password management</p>
               </motion.div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                     {
                        icon: Shield,
                        title: "Secure Generation",
                        description: "Uses cryptographically secure random number generation to create strong, unpredictable passwords.",
                        bgColor: "bg-blue-50 dark:bg-blue-900/20",
                        iconColor: "text-blue-600",
                     },
                     {
                        icon: Zap,
                        title: "Instant Results",
                        description: "Generate passwords instantly with customizable length and character sets. No waiting, no complexity.",
                        bgColor: "bg-green-50 dark:bg-green-900/20",
                        iconColor: "text-green-600",
                     },
                     {
                        icon: Database,
                        title: "Privacy First",
                        description: "Everything happens in your browser. No passwords are sent to servers or stored remotely.",
                        bgColor: "bg-purple-50 dark:bg-purple-900/20",
                        iconColor: "text-purple-600",
                     },
                     {
                        icon: Github,
                        title: "Open Source",
                        description: "Fully open source and transparent. You can inspect, verify, and contribute to the code.",
                        bgColor: "bg-gray-50 dark:bg-gray-800/20",
                        iconColor: "text-gray-600",
                     },
                  ].map((feature, index) => (
                     <motion.div
                        key={feature.title}
                        variants={{
                           hidden: { opacity: 0, y: 30 },
                           visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                 duration: 0.6,
                                 delay: index * 0.1,
                              },
                           },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-50px" }}
                     >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                           <CardContent className="p-8 text-center">
                              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                 <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                              </div>
                              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-4">{feature.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                           </CardContent>
                        </Card>
                     </motion.div>
                  ))}
               </div>

               {!user && (
                  <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} className="mt-16 max-w-2xl mx-auto">
                     <Card className="bg-blue-50 dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-700 shadow-xl">
                        <CardHeader className="text-center">
                           <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Join the Security Revolution</CardTitle>
                           <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                              Transform how you protect your digital identity. Start your journey to bulletproof security.
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex flex-col sm:flex-row gap-3">
                              <Link to="/auth" className="flex-1">
                                 <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-lg py-6 shadow-lg">
                                    <User className="w-5 h-5 mr-2" />
                                    Sign In
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                 </Button>
                              </Link>
                              <Link to="/signup" className="flex-1">
                                 <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg py-6 shadow-lg">
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Sign Up
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                 </Button>
                              </Link>
                           </div>
                           <p className="text-sm text-center text-gray-500 dark:text-gray-400">Free to use • Secure encryption • No ads</p>
                        </CardContent>
                     </Card>
                  </motion.div>
               )}
            </div>
         </section>

         {/* Footer */}
         <motion.footer
            variants={scrollVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={logoImage} alt="iLovePasswords Logo" className="w-full h-full object-contain" />
                     </div>
                     <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">iLovePasswords</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Where digital security meets elegant simplicity</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">&copy; 2024 iLovePasswords. Built with security in mind.</p>
               </div>
            </div>
         </motion.footer>
      </div>
   );
};

export default Landing;
