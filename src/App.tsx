import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VaultPage from "./pages/VaultPage";

function App() {
   return (
      <ThemeProvider>
         <AuthProvider>
            <div className="min-h-screen">
               <Router>
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="/auth" element={<Auth />} />
                     <Route path="/vault" element={<VaultPage />} />
                  </Routes>
               </Router>
            </div>
         </AuthProvider>
      </ThemeProvider>
   );
}

export default App;
