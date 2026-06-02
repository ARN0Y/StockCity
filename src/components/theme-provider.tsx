"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "stockcity-theme"

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
    theme: "light",
    toggle: () => {},
    setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light")

    useEffect(() => {
        const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light"
        setThemeState(stored)
    }, [])

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle("dark", theme === "dark")
    }, [theme])

    const setTheme = (next: Theme) => {
        localStorage.setItem(STORAGE_KEY, next)
        setThemeState(next)
    }

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark")

    return (
        <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`
