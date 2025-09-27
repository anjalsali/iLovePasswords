import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import type { Theme, ThemeContextType } from "../types";

interface ThemeProviderProps {
   children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
   const [theme, setTheme] = useState<Theme>(() => {
      // Check localStorage first, then system preference
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) {
         return savedTheme;
      }

      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
         return "dark";
      }

      return "light";
   });

   useEffect(() => {
      const root = window.document.documentElement;

      // Remove previous theme classes
      root.classList.remove("light", "dark");

      // Add current theme class
      root.classList.add(theme);

      // Save to localStorage
      localStorage.setItem("theme", theme);
   }, [theme]);

   const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
   };

   const value: ThemeContextType = {
      theme,
      toggleTheme,
      setTheme,
   };

   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
