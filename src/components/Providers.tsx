"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
// https://stackoverflow.com/questions/77026759/using-next-themes-for-dark-mode-generates-hydration-failed-error
const Providers = ({ children, ...props }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <>{children}</>; // Render children without ThemeProvider during SSR
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;
