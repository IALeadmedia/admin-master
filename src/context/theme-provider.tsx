import { ConfigProvider, theme } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
} from "react";
import { appSetting } from "../constants/app-setting/config.const";

export interface IThemeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<IThemeContext | null>(null);

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  useEffect(() => {
    const html = document.querySelector("html");

    if (html) {
      if (isDarkMode) html.classList.add("dark");
      else html.classList.remove("dark");
    }

    localStorage.setItem("theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode: () => setIsDarkMode((prev) => !prev),
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: appSetting.primaryColor,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
