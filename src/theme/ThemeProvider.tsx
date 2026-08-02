import React, { createContext, useContext, useState, ReactNode } from "react";

// ----------------------------
// Updated light and dark themes
// ----------------------------
export const lightTheme = {
  background: "#F7F7F5",          // soft off-white / eggshell
  backgroundSecondary: "#FFFFFF", // cards / panels
  text: "#000000",
  buttonBackground: "#250f74",
  buttonText: "#ffffff",
  // add any other colors you use
};

export const darkTheme = {
  background: "#000000",
  backgroundSecondary: "#1A1A1A",
  text: "#FFFFFF",
  buttonBackground: "#250f74",
  buttonText: "#FFFFFF",
  // add any other colors you use
};

// ----------------------------
// Theme Context & Provider
// ----------------------------
type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: typeof lightTheme; // same shape as your theme objects
  themeMode: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeType>("light");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ----------------------------
// Hook to use theme
// ----------------------------
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};