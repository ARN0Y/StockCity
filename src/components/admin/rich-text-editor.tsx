"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Heading4,
    Quote,
    Undo,
    Redo,
    AlignCenter,
    AlignRight,
    AlignLeft,
    ImageIcon,
    Loader2,
    Link as LinkIcon,
    Unlink,
    Minus,
    Code,
    Pilcrow,
    RemoveFormatting,
    Maximize2,
    Minimize2,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { uploadProductImage } from "@/app/actions/upload"

interface Props {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function RichTextEditor({ value, onChange, disabled }: Props) {
    const [uploading, setUploading] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)

    useEffect(() => {
        if (fullscreen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [fullscreen])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFullscreen(false)
        }
        if (fullscreen) window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [fullscreen])

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc list-inside space-y-1 my-3",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal list-inside space-y-1 my-3",
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: "border-r-4 border-blue-300 bg-blue-50/50 pr-4 py-2 my-3 italic",
                    },
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: "my-6 border-slate-200",
                    },
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: "bg-slate-900 text-slate-100 rounded-lg p-4 text-sm font-mono my-3 overflow-x-auto",
                    },
                },
            }),
            Underline,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: "rounded-lg border border-slate-200 my-6 max-w-full h-auto mx-auto block shadow-sm",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                defaultAlignment: "right",
            }),
            Placeholder.configure({
                placeholder: "توضیحات کامل محصول را اینجا بنویسید...",
                emptyEditorClass:
                    "before:content-[attr(data-placeholder)] before:text-slate-400 before:float-right before:pointer-events-none before:h-0",
            }),
        ],
        content: value || "",
        editable: !disabled,
        onUpdate: ({ editor: ed }) => {
            const html = ed.getHTML()
            if (html === "<p></p>" || html === '<p dir="auto"></p>') {
                onChange("")
            } else {
                onChange(html)
            }
        },
        editorProps: {
            attributes: {
                class: "px-6 py-5 text-[15px] leading-8 focus-visible:outline-none prose prose-slate dark:prose-invert max-w-none [direction:rtl] prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg",
                dir: "rtl",
            },
        },
    })

    useEffect(() => {
        if (!editor) return
        if (!value) {
            if (editor.getHTML() !== "<p></p>") {
                editor.commands.setContent("")
            }
            return
        }
        const currentHTML = editor.getHTML()
        if (value !== currentHTML) {
            const { from, to } = editor.state.selection
            editor.commands.setContent(value, { emitUpdate: false })
            try {
                const docSize = editor.state.doc.content.size
                const safeFrom = Math.min(from, docSize)
                const safeTo = Math.min(to, docSize)
                editor.commands.setTextSelection({ from: safeFrom, to: safeTo })
            } catch {
            }
        }
    }, [value, editor])

    const addLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("آدرس لینک:", previousUrl || "https://")
        if (url === null) return
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }, [editor])

    const uploadImage = useCallback(() => {
        if (!editor) return
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return
            setUploading(true)
            try {
                const fd = new FormData()
                fd.append("file", file)
                const res = await uploadProductImage(fd)
                if (res.success && res.url) {
                    editor.chain().focus().setImage({ src: res.url, alt: file.name }).run()
                } else {
                    alert(res.error || "خطا در آپلود تصویر")
                }
            } finally {
                setUploading(false)
            }
        }
        input.click()
    }, [editor])

    if (!editor) {
        return (
            <div className="border rounded-lg overflow-hidden">
                <div className="h-12 bg-muted border-b border-border animate-pulse" />
                <div className="h-[600px] animate-pulse bg-card" />
            </div>
        )
    }

    const ToolBtn = ({
                         icon: Icon,
                         label,
                         active,
                         disabled: btnDisabled,
                         onClick,
                     }: {
        icon: any
        label: string
        active?: boolean
        disabled?: boolean
        onClick: () => void
    }) => (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Toggle
                        size="sm"
                        pressed={active}
                        disabled={btnDisabled}
                        onPressedChange={onClick}
                        className={cn(
                            "h-8 w-8 p-0 data-[state=on]:bg-primary/15 data-[state=on]:text-primary hover:bg-accent text-muted-foreground",
                            active && "bg-primary/15 text-primary"
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-slate-800 text-white border-0">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    const ToolSep = () => <Separator orientation="vertical" className="h-5 mx-0.5 bg-slate-200" />

    return (
        <div
            className={cn(
                "border border-border bg-card focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring transition-all shadow-sm flex flex-col",
                fullscreen
                    ? "fixed inset-0 z-[100] rounded-none"
                    : "rounded-lg overflow-hidden",
            )}
        >
            
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 backdrop-blur-sm px-2 py-1.5 sticky top-0 z-20">
                
                <ToolBtn
                    icon={Bold}
                    label="بولد (Ctrl+B)"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolBtn
                    icon={Italic}
                    label="ایتالیک (Ctrl+I)"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <ToolBtn
                    icon={UnderlineIcon}
                    label="خط زیر (Ctrl+U)"
                    active={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />

                <ToolSep />

                
                <ToolBtn
                    icon={Pilcrow}
                    label="پاراگراف ساده"
                    active={editor.isActive("paragraph")}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                />
                <ToolBtn
                    icon={Heading2}
                    label="تیتر ۲ (H2)"
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                />
                <ToolBtn
                    icon={Heading3}
                    label="تیتر ۳ (H3)"
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                />
                <ToolBtn
                    icon={Heading4}
                    label="تیتر ۴ (H4)"
                    active={editor.isActive("heading", { level: 4 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 4 }).run()
                    }
                />

                <ToolSep />

                
                <ToolBtn
                    icon={List}
                    label="لیست نقطه‌ای"
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <ToolBtn
                    icon={ListOrdered}
                    label="لیست شماره‌ای"
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
                <ToolBtn
                    icon={Quote}
                    label="نقل قول"
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
                <ToolBtn
                    icon={Code}
                    label="کد"
                    active={editor.isActive("codeBlock")}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />

                <ToolSep />

                
                <ToolBtn
                    icon={AlignRight}
                    label="راست‌چین"
                    active={editor.isActive({ textAlign: "right" })}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                />
                <ToolBtn
                    icon={AlignCenter}
                    label="وسط‌چین"
                    active={editor.isActive({ textAlign: "center" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                />
                <ToolBtn
                    icon={AlignLeft}
                    label="چپ‌چین"
                    active={editor.isActive({ textAlign: "left" })}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                />

                <ToolSep />

                
                <ToolBtn
                    icon={LinkIcon}
                    label="افزودن لینک"
                    active={editor.isActive("link")}
                    onClick={addLink}
                />
                {editor.isActive("link") && (
                    <ToolBtn
                        icon={Unlink}
                        label="حذف لینک"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .extendMarkRange("link")
                                .unsetLink()
                                .run()
                        }
                    />
                )}

                
                <ToolBtn
                    icon={Minus}
                    label="خط جداکننده افقی"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                />

                <ToolSep />

                
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={uploadImage}
                    disabled={uploading}
                    className="h-8 text-xs gap-1 px-2 text-muted-foreground hover:text-primary hover:bg-accent"
                >
                    {uploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">تصویر</span>
                </Button>

                
                <ToolBtn
                    icon={RemoveFormatting}
                    label="پاک کردن فرمت"
                    onClick={() =>
                        editor.chain().focus().clearNodes().unsetAllMarks().run()
                    }
                />

                
                <div className="mr-auto flex items-center gap-0.5">
                    <ToolBtn
                        icon={Undo}
                        label="برگردان (Ctrl+Z)"
                        disabled={!editor.can().undo()}
                        onClick={() => editor.chain().focus().undo().run()}
                    />
                    <ToolBtn
                        icon={Redo}
                        label="از نو (Ctrl+Y)"
                        disabled={!editor.can().redo()}
                        onClick={() => editor.chain().focus().redo().run()}
                    />
                    <ToolSep />
                    <ToolBtn
                        icon={fullscreen ? Minimize2 : Maximize2}
                        label={fullscreen ? "خروج از تمام‌صفحه (Esc)" : "حالت تمام‌صفحه"}
                        active={fullscreen}
                        onClick={() => setFullscreen((v) => !v)}
                    />
                </div>
            </div>

            
            {editor && (
                <BubbleMenu
                    editor={editor}
                    className="bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 flex items-center gap-0.5 p-1 animate-in zoom-in-95 duration-200"
                >
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", editor.isActive("bold") && "bg-slate-700 text-blue-300")}
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", editor.isActive("italic") && "bg-slate-700 text-blue-300")}
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", editor.isActive("underline") && "bg-slate-700 text-blue-300")}
                    >
                        <UnderlineIcon className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-600 mx-0.5" />
                    <button
                        type="button"
                        onClick={addLink}
                        className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", editor.isActive("link") && "bg-slate-700 text-blue-300")}
                    >
                        <LinkIcon className="h-3.5 w-3.5" />
                    </button>
                </BubbleMenu>
            )}

            
            <div
                className={cn(
                    "relative overflow-y-auto bg-card",
                    fullscreen ? "flex-1" : "min-h-[700px] max-h-[80vh]",
                )}
            >
                <EditorContent editor={editor} />
            </div>

            
            <div className="border-t border-border bg-muted/30 px-3 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono shrink-0">
                <span>
                    {editor.storage.characterCount?.characters?.() ?? editor.getText().length} کاراکتر
                </span>
                <span>
                    {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} کلمه
                </span>
            </div>
        </div>
    )
}