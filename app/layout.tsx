"use client";

import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <html lang="en">
      <body>
        {children}

        {/* THEME TOGGLE BUTTON */}
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="fixed bottom-4 left-4 z-50 rounded-full border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-black shadow dark:bg-black dark:text-white"
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </body>
    </html>
  );
}
