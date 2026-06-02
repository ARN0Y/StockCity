"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

interface Props {
    value: string[]
    onChange: (value: string[]) => void
}

export function KeyFeaturesInput({ value = [], onChange }: Props) {
    const [input, setInput] = useState("")

    const add = () => {
        const trimmed = input.trim()
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
            setInput("")
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    placeholder="مثال: قابلیت نصب روی ریل DIN"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            add()
                        }
                    }}
                />
                <Button type="button" onClick={add} variant="outline" size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((item, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100"
                        >
              {item}
                            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </span>
                    ))}
                </div>
            )}
        </div>
    )
}