// src/context/TextSizeContext.tsx

import React, { createContext, useContext, useState } from "react";

type TextSizeContextType = {
  textScale: number;
  setTextScale: (value: number) => void;
};

const TextSizeContext = createContext<TextSizeContextType | undefined>(
  undefined
);

export function TextSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default middle position
  const [textScale, setTextScale] = useState(1);

  return (
    <TextSizeContext.Provider value={{ textScale, setTextScale }}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const context = useContext(TextSizeContext);

  if (!context) {
    throw new Error("useTextSize must be used inside TextSizeProvider");
  }

  return context;
}