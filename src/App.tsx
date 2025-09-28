import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import Settings from "./pages/Settings";
import { useAuth } from "./hooks/useAuth";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { user, loading } = useAuth();

   if (loading) {
      return (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-blue-600" />
         </motion.div>
      );
   }

   return user ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { user, loading } = useAuth();

   if (loading) {
      return (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-blue-600" />
         </motion.div>
      );
   }

   return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
         {children}
      </motion.div>
   );
};

// Animated Routes Component
const AnimatedRoutes: React.FC = () => {
   const location = useLocation();

   return (
      <AnimatePresence mode="wait">
         <Routes location={location} key={location.pathname}>
            <Route
               path="/"
               element={
                  <PublicRoute>
                     <PageTransition>
                        <Landing />
                     </PageTransition>
                  </PublicRoute>
               }
            />
            <Route
               path="/auth"
               element={
                  <PublicRoute>
                     <PageTransition>
                        <Auth />
                     </PageTransition>
                  </PublicRoute>
               }
            />
            <Route
               path="/signup"
               element={
                  <PublicRoute>
                     <PageTransition>
                        <Signup />
                     </PageTransition>
                  </PublicRoute>
               }
            />
            <Route
               path="/dashboard"
               element={
                  <ProtectedRoute>
                     <PageTransition>
                        <Dashboard />
                     </PageTransition>
                  </ProtectedRoute>
               }
            />
            <Route
               path="/vault"
               element={
                  <ProtectedRoute>
                     <PageTransition>
                        <Vault />
                     </PageTransition>
                  </ProtectedRoute>
               }
            />
            <Route
               path="/settings"
               element={
                  <ProtectedRoute>
                     <PageTransition>
                        <Settings />
                     </PageTransition>
                  </ProtectedRoute>
               }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </AnimatePresence>
   );
};

function App() {
   return (
      <ThemeProvider>
         <AuthProvider>
            <div className="min-h-screen">
               <Router>
                  <AnimatedRoutes />
               </Router>
            </div>
         </AuthProvider>
      </ThemeProvider>
   );
}

export default App;
