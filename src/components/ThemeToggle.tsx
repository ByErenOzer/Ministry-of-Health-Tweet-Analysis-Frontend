
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors duration-300"
      >
        {isDarkMode ? (
          <Moon className="h-6 w-6 text-health-400 animate-pulse" />
        ) : (
          <Sun className="h-6 w-6 text-yellow-500 animate-pulse" />
        )}
      </motion.button>
    </motion.div>
  );
}
