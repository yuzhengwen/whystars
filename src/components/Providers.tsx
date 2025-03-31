"use client";
import dynamic from "next/dynamic";
import React from "react";
import {
  //ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
//https://github.com/shadcn-ui/ui/issues/5552
const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);
const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};

export default Providers;
