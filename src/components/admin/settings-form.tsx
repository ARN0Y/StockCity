"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveSiteSettings } from "@/app/actions/settings"
import { Save, Loader2, Megaphone, Phone, MapPin, Share2, ShieldCheck } from "lucide-react"

interface Props {
    initial: Record<string, string>
}

export function SettingsForm({ initial }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)

    const [v, setV] = useState({
        nameFa: initial.nameFa || "",
        phoneDisplay: initial.phoneDisplay || "",
        phoneRaw: initial.phoneRaw || "",
        whatsapp: initial.whatsapp || "",
        address: initial.address || "",
        addressShort: initial.addressShort || "",
        hours: initial.hours || "",
        warrantyBrand: initial.warrantyBrand || "",
        warrantyNote: initial.warrantyNote || "",
        telegram: initial.telegram || "",
        instagram: initial.instagram || "",
        announcementEnabled: initial.announcementEnabled === "1",
        announcementText: initial.announcementText || "",
        announcementLink: initial.announcementLink || "",
    })

    const set = (key: keyof typeof v, value: string | boolean) =>
        setV((prev) => ({ ...prev, [key]: value }))

    const handleSave = async () => {
        setSaving(true)
        const payload: Record<string, string> = {
            ...v,
            announcementEnabled: v.announcementEnabled ? "1" : "0",
        } as any
        const res = await saveSiteSettings(payload)
        setSaving(false)
        if (res.success) {
            toast({ title: "ذخیره شد", description: "تنظیمات سایت به‌روزرسانی شد." })
            router.refresh()
        } else {
            toast({ title: "خطا", description: res.error, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">تنظیمات سایت</h1>
                    <p className="text-sm text-muted-foreground mt-1">اطلاعات تماس، اعلان و شبکه‌های اجتماعی</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 font-bold h-11 px-6">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    ذخیره تغییرات
                </Button>
            </div>

            {/* نوار اعلان */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-primary" /> نوار اعلان بالای سایت
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                        <div>
                            <p className="text-sm font-medium">نمایش نوار اعلان</p>
                            <p className="text-xs text-muted-foreground mt-0.5">یک نوار رنگی در بالاترین قسمت همه‌ی صفحات</p>
                        </div>
                        <Switch checked={v.announcementEnabled} onCheckedChange={(c) => set("announcementEnabled", c)} />
                    </div>
                    <div className="space-y-2">
                        <Label>متن اعلان</Label>
                        <Input value={v.announcementText} onChange={(e) => set("announcementText", e.target.value)} placeholder="مثال: ارسال رایگان برای خرید بالای ۵ میلیون تومان" />
                    </div>
                    <div className="space-y-2">
                        <Label>لینک اعلان <span className="text-muted-foreground font-normal">(اختیاری)</span></Label>
                        <Input value={v.announcementLink} onChange={(e) => set("announcementLink", e.target.value)} placeholder="/products یا https://..." dir="ltr" className="text-left" />
                    </div>
                </CardContent>
            </Card>

            {/* اطلاعات تماس */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> اطلاعات تماس
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>نام فروشگاه (فارسی)</Label>
                        <Input value={v.nameFa} onChange={(e) => set("nameFa", e.target.value)} placeholder="استوک سیتی" />
                    </div>
                    <div className="space-y-2">
                        <Label>ساعت کاری</Label>
                        <Input value={v.hours} onChange={(e) => set("hours", e.target.value)} placeholder="۹ صبح تا ۵ بعد از ظهر" />
                    </div>
                    <div className="space-y-2">
                        <Label>شماره تماس (نمایشی)</Label>
                        <Input value={v.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} placeholder="۰۹۱۳۴۸۹۱۳۸۰" dir="ltr" className="text-left" />
                    </div>
                    <div className="space-y-2">
                        <Label>شماره تماس (برای دکمه‌ها)</Label>
                        <Input value={v.phoneRaw} onChange={(e) => set("phoneRaw", e.target.value)} placeholder="09134891380" dir="ltr" className="text-left font-mono" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>شماره واتساپ (با کد کشور، بدون +)</Label>
                        <Input value={v.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="989134891380" dir="ltr" className="text-left font-mono" />
                    </div>
                </CardContent>
            </Card>

            {/* آدرس */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> آدرس
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>آدرس کامل</Label>
                        <Input value={v.address} onChange={(e) => set("address", e.target.value)} placeholder="اصفهان، شهرک صنعتی دولت‌آباد، خیابان ۳۸" />
                    </div>
                    <div className="space-y-2">
                        <Label>آدرس کوتاه (برای هدر)</Label>
                        <Input value={v.addressShort} onChange={(e) => set("addressShort", e.target.value)} placeholder="اصفهان، شهرک صنعتی دولت‌آباد" />
                    </div>
                </CardContent>
            </Card>

            {/* گارانتی */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" /> گارانتی
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>نام برند گارانتی</Label>
                        <Input value={v.warrantyBrand} onChange={(e) => set("warrantyBrand", e.target.value)} placeholder="Patvaz" dir="ltr" className="text-left" />
                    </div>
                    <div className="space-y-2">
                        <Label>توضیح گارانتی</Label>
                        <Textarea value={v.warrantyNote} onChange={(e) => set("warrantyNote", e.target.value)} placeholder="محصولات برند پاتواز دارای گارانتی تعویض هستند." rows={2} />
                    </div>
                </CardContent>
            </Card>

            {/* شبکه‌های اجتماعی */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-primary" /> شبکه‌های اجتماعی
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>لینک تلگرام</Label>
                        <Input value={v.telegram} onChange={(e) => set("telegram", e.target.value)} placeholder="https://t.me/..." dir="ltr" className="text-left" />
                    </div>
                    <div className="space-y-2">
                        <Label>لینک اینستاگرام</Label>
                        <Input value={v.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." dir="ltr" className="text-left" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2 font-bold h-11 px-8">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    ذخیره تغییرات
                </Button>
            </div>
        </div>
    )
}
