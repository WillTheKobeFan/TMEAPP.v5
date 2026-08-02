// src/theme/colors.ts

export type Theme = {
  background: string;
  backgroundSecondary: string;
  text: string;
  buttonBackground: string;
  buttonText: string;
  card: string; // ✅ FORCE TYPE
};

export const colors = {
  primary: "#250F74",
  primarySoft: "#EEEAFB",

  background: "#F7F5FC",
  surface: "#FFFFFF",

  text: "#17131F",
  textMuted: "#716B7A",

  border: "#E5E0EC",

  success: "#168A45",
  warning: "#D97706",
  danger: "#C73535",

  transparent: "transparent",
} as const;

//====================================//

//export const lightTheme: Theme = {
  //background: "#ffffff",
  //backgroundSecondary: "#f5f5f5",
  //text: "#000000",
  //buttonBackground: "#6200ee",
  //buttonText: "#ffffff",
  //card: "#e0e0e0",
//};

//export const darkTheme: Theme = {
  //background: "#121212",
  //backgroundSecondary: "#1e1e1e",
  //text: "#ffffff",
  //buttonBackground: "#bb86fc",
  //buttonText: "#000000",
  //card: "#2a2a2a",
//};

//====================================//