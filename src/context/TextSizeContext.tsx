// src/context/TextSizeContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const MIN_TEXT_SCALE = 0.85;
const MAX_TEXT_SCALE = 1.3;

type TextSizeContextType = {
  textScale: number;
  setTextScale: (value: number) => void;
  resetTextScale: () => void;
};

const TextSizeContext =
  createContext<TextSizeContextType | undefined>(
    undefined
  );

type TextSizeProviderProps = {
  children: React.ReactNode;
};

export function TextSizeProvider({
  children,
}: TextSizeProviderProps) {
  const [textScale, setTextScaleState] =
    useState(1);

  const setTextScale = useCallback(
    (value: number) => {
      const clampedValue = Math.min(
        MAX_TEXT_SCALE,
        Math.max(MIN_TEXT_SCALE, value)
      );

      setTextScaleState(clampedValue);
    },
    []
  );

  const resetTextScale = useCallback(() => {
    setTextScaleState(1);
  }, []);

  const value = useMemo(
    () => ({
      textScale,
      setTextScale,
      resetTextScale,
    }),
    [
      textScale,
      setTextScale,
      resetTextScale,
    ]
  );

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const context = useContext(TextSizeContext);

  if (!context) {
    throw new Error(
      "useTextSize must be used inside TextSizeProvider"
    );
  }

  return context;
}