import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultPresets } from "@/config/Theme";
const ThemeProviderContext = createContext({
  theme: "light",
  themeSet: "default",
  setTheme: () => null,
  setThemeSet: () => null,
});

let themeState = { theme: "light", themeSet: "default" };

const updateThemeState = (newTheme, newThemeSet) => {
  themeState = { theme: newTheme, themeSet: newThemeSet };
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultThemeSet = "default",
  storageKey = "vite-ui-theme",
  storageKeySet = "vite-ui-theme-set",
}) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
  const [themeSet, setThemeSet] = useState(
    () => localStorage.getItem(storageKeySet) || defaultThemeSet
  );

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove existing theme classes
    root.classList.remove("light", "dark");
    // Remove all possible theme set classes
    Object.keys(defaultPresets).forEach((preset) => {
      root.classList.remove(`theme-${preset}`);
    });

    // Apply the current theme set and mode classes
    root.classList.add(`theme-${themeSet}`, theme);

    // Apply CSS custom properties from the selected preset
    const preset = defaultPresets[themeSet]?.styles[theme];
    if (preset) {
      Object.entries(preset).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    updateThemeState(theme, themeSet);
  }, [theme, themeSet]);

  const value = {
    theme,
    themeSet,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      updateThemeState(newTheme, themeSet);
    },
    setThemeSet: (newThemeSet) => {
      localStorage.setItem(storageKeySet, newThemeSet);
      setThemeSet(newThemeSet);
      updateThemeState(theme, newThemeSet);
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const getThemeState = () => themeState;