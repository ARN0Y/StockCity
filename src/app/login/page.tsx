"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"
import { Loader2, ShieldCheck, AlertCircle, Zap } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-primary text-white transition-colors dark:bg-primary dark:hover:bg-primary/90"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "ورود به پنل"}
        </Button>
    )
}

export default function LoginPage() {
    const [state, formAction] = useActionState(loginAction, {})

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-muted/40 p-4 relative overflow-hidden"
            dir="rtl"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute -top-40 -right-40 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-slate-900 dark:bg-primary/15 p-3 rounded-2xl shadow-lg mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-foreground">{siteConfig.nameEn}</h1>
                    <p className="text-sm text-muted-foreground mt-1">پنل مدیریت {siteConfig.nameFa}</p>
                </div>

                <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
                    <form action={formAction} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username">نام کاربری</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="admin"
                                autoComplete="username"
                                className="h-12"
                                dir="ltr"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">رمز عبور</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="h-12"
                                dir="ltr"
                                required
                            />
                        </div>

                        {state?.error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ورود امن به پنل مدیریت فروشگاه
                </p>
            </div>
        </div>
    )
}
