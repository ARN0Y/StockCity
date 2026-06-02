import Link from "next/link"
import { Megaphone } from "lucide-react"

interface Props {
    text: string
    link?: string
}

export function AnnouncementBar({ text, link }: Props) {
    if (!text?.trim()) return null

    const content = (
        <div className="flex items-center justify-center gap-2 text-center">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{text}</span>
        </div>
    )

    return (
        <div className="bg-primary text-primary-foreground py-2 px-4">
            {link ? (
                <Link href={link} className="block hover:opacity-90 transition-opacity">
                    {content}
                </Link>
            ) : (
                content
            )}
        </div>
    )
}
