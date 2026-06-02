"use client"

import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <LogOut className="w-5 h-5" /> خروج از حساب
            </Button>
        </form>
    )
}
