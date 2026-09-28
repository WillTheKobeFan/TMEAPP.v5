// src/theme/typography.ts

export const typography = {
  display: 32,

  title: 28,
  heading: 22,
  subheading: 18,

  body: 16,
  caption: 14,
  small: 12,
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extraBold: "800",
} as const;

export const lineHeights = {
  display: 40,
  title: 34,
  heading: 28,
  subheading: 24,
  body: 22,
  caption: 20,
  small: 16,
} as const;