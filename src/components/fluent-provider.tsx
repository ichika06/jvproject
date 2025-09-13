"use client"

import React from "react"

import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components"
import { useTheme } from "next-themes"

interface FluentThemeProviderProps {
  children: React.ReactNode
}

export function FluentThemeProvider({ children }: FluentThemeProviderProps) {
  const { theme } = useTheme()

  return <FluentProvider theme={theme === "dark" ? webDarkTheme : webLightTheme}>{children}</FluentProvider>
}