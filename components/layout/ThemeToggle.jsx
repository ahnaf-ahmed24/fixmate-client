"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";


export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("fixmate");

  useEffect(() => {
    const saved = localStorage.getItem("fixmate-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "fixmate-dark" : "fixmate"));
  }, []);

  const toggle = () => {
    const next = theme === "fixmate" ? "fixmate-dark" : "fixmate";
    setTheme(next);
    localStorage.setItem("fixmate-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={theme === "fixmate" ? "Switch to dark mode" : "Switch to light mode"}
      className={`btn btn-ghost btn-circle btn-sm ${className}`}
    >
      {theme === "fixmate" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
    </button>
  );
}
