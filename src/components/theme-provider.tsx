"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "stockcity-theme"

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
    theme: "light",
    toggle: () => {},
    setTheme: () => {},
})

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light"
    try {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        if (stored === "light" || stored === "dark") return stored
        if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark"
    } catch {
    }
    return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light")

    useEffect(() => {
        setThemeState(getInitialTheme())
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem(STORAGE_KEY)) setThemeState(e.matches ? "dark" : "light")
        }
        mq.addEventListener?.("change", onChange)
        return () => mq.removeEventListener?.("change", onChange)
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    const setTheme = (next: Theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
        }
        setThemeState(next)
    }

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark")

    return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext)
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="dark"||(!t&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`
