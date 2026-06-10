"use client";

import { Moon, SunMedium } from "lucide-react";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "glass-wallet-theme";
const THEME_EVENT = "glass-wallet-theme-change";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") {
      return current;
    }
  }

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => { };
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => onStoreChange();

  window.addEventListener(THEME_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  mediaQuery.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener(THEME_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
    mediaQuery.removeEventListener("change", handleChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, resolveTheme, () => "light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      aria-expanded={false}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className="flex items-center gap-2 block px-4 py-2.5 theme-text-muted hover:bg-[color:var(--surface-soft)] hover:theme-text-default w-full"
      title={`${theme === "light" ? "Dark" : "Light"} mode`}
    >
      <span className={`${theme === "dark" ? "theme-text" : "theme-text-muted"} flex gap-2 items-center w-full`}>
        {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}

        {
          theme
        }
      </span>
    </button>
  );
}
