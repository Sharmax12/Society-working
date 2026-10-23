"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
      className="cursor-pointer rounded-md p-2"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-white" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-black" aria-hidden="true" />
      )}
    </button>
  );
}
