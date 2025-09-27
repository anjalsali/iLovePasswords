import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AuthContextType } from "../types";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
   children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Get initial session
      const getInitialSession = async () => {
         console.log("🔄 Getting initial session...");
         const {
            data: { session },
         } = await supabase.auth.getSession();
         const currentUser = session?.user ?? null;
         console.log("👤 Current user:", currentUser?.email || "none");
         setUser(currentUser);
         console.log("✅ Initial session check complete");
         setLoading(false);
      };

      getInitialSession();

      // Listen for auth changes
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         console.log("🔄 Auth state changed:", event);
         const newUser = session?.user ?? null;
         console.log("👤 New user:", newUser?.email || "none");
         setUser(newUser);
         console.log("✅ Auth state change complete");
         setLoading(false);
      });

      return () => subscription.unsubscribe();
   }, []);

   const signIn = async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });
      if (error) throw error;
   };

   const signUp = async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
         email,
         password,
      });
      if (error) throw error;
   };

   const signInWithGoogle = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
            redirectTo: `${window.location.origin}/dashboard`,
         },
      });
      if (error) throw error;
   };

   const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
   };

   const value: AuthContextType = {
      user,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      loading,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
