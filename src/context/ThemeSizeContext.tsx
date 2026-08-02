// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your theme
type Theme = {
  background: string;
  backgroundSecondary: string;
  text: string;
  card: string;
};

// Define context type
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const [theme, setTheme] = useState<Theme>({
    background: "#ffffff",
    backgroundSecondary: "#f2f2f2", //
    text: "#000000",
    card: "#f0f0f0",
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};