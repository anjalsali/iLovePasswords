import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VaultPage from "./pages/VaultPage";

function App() {
   return (
      <AuthProvider>
         <Router>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/auth" element={<Auth />} />
               <Route path="/vault" element={<VaultPage />} />
            </Routes>
         </Router>
      </AuthProvider>
   );
}

export default App;
