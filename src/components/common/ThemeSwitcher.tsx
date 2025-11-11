import React from "react";
import { Button } from "antd";
import { useThemeStore } from "../../store/themeStore";
import { MoonStar, Sun } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Button
      shape="circle"
      icon={isDarkMode ? <Sun className="mt-1" /> : <MoonStar className="mt-1" />}
      onClick={toggleTheme}
      className="flex items-center gap-2"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* <span className="hidden sm:inline">{isDarkMode ? "Dark" : "Light"}</span> */}
    </Button>
  );
};

export default ThemeSwitcher;
