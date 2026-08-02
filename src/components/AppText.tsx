// app/components/AppText.tsx
import React from "react";
import { Text, TextProps } from "react-native";
import { useTextSize } from "src/context/TextSizeContext";

type AppTextProps = TextProps & {
  small?: number;
  medium?: number;
  large?: number;
};

export default function AppText({ small = 14, medium = 20, large = 26, style, children, ...props }: AppTextProps) {
  const { textSize } = useTextSize();

  let fontSize = medium;
  if (textSize === "Small") fontSize = small;
  else if (textSize === "Large") fontSize = large;

  return (
    <Text style={[{ fontSize }, style]} {...props}>
      {children}
    </Text>
  );
}