// src/theme/ThemeProvider.tsx

import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark";

const sharedColors = {
  primary: "#250F74",
  primarySoft: "#EEEAFB",

  success: "#168A45",
  warning: "#D97706",
  danger: "#C73535",

  transparent: "transparent",
};

export const lightTheme = {
  ...sharedColors,

  background: "#F7F5FC",
  backgroundSecondary: "#FFFFFF",

  surface: "#FFFFFF",
  card: "#FFFFFF",

  text: "#17131F",
  textMuted: "#716B7A",

  border: "#E5E0EC",

  buttonBackground: "#250F74",
  buttonText: "#FFFFFF",

  navBackground: "#250F74",
  navText: "#FFFFFF",

  headerText: "#250F74",
  headerIcon: "#250F74",

  logoSurface: "#FFFFFF",
  logoBorder: "#E5E0EC",
};

export const darkTheme: typeof lightTheme = {
  ...sharedColors,

  background: "#0D0D0F",
  backgroundSecondary: "#171719",

  surface: "#171719",
  card: "#1D1D20",

  text: "#F7F7F8",
  textMuted: "#A9A6AE",

  border: "#343238",

  buttonBackground: "#250F74",
  buttonText: "#FFFFFF",

  navBackground: "#250F74",
  navText: "#FFFFFF",

  headerText: "#FFFFFF",
  headerIcon: "#FFFFFF",

  // Branding stays unchanged in Dark Mode.
  // SportSync protects logos with a neutral dark surface.
  logoSurface: "#242427",
  logoBorder: "#4A474F",
};

export type AppTheme = typeof lightTheme;

type ThemeContextType = {
  theme: AppTheme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark: themeMode === "dark",
      setThemeMode,
      toggleTheme: () =>
        setThemeMode((current) =>
          current === "light" ? "dark" : "light"
        ),
    }),
    [theme, themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}