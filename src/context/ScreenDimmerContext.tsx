// src/context/ScreenDimmerContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type ScreenDimmerContextType = {
  dimAmount: number;
  setDimAmount: (value: number) => void;
};

const STORAGE_KEY = "screenDimmerAmount";

const ScreenDimmerContext =
  createContext<ScreenDimmerContextType | undefined>(undefined);

export function ScreenDimmerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dimAmount, setDimAmountState] = useState(0);

  useEffect(() => {
    const loadDimAmount = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedValue !== null) {
          setDimAmountState(Number(savedValue));
        }
      } catch (error) {
        console.log("Failed to load screen dimmer setting:", error);
      }
    };

    loadDimAmount();
  }, []);

  const setDimAmount = async (value: number) => {
    try {
      setDimAmountState(value);
      await AsyncStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      console.log("Failed to save screen dimmer setting:", error);
    }
  };

  return (
    <ScreenDimmerContext.Provider
      value={{
        dimAmount,
        setDimAmount,
      }}
    >
      {children}
    </ScreenDimmerContext.Provider>
  );
}

export function useScreenDimmer() {
  const context = useContext(ScreenDimmerContext);

  if (!context) {
    throw new Error(
      "useScreenDimmer must be used inside ScreenDimmerProvider"
    );
  }

  return context;
}