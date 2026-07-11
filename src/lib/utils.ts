import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** قیمت را با جداکننده‌ی هزارگان و ارقام فارسی به «تومان» تبدیل می‌کند. */
export function formatToman(price?: number | null): string | null {
  if (price == null || !Number.isFinite(price) || price <= 0) return null
  return `${price.toLocaleString("fa-IR")} تومان`
}
