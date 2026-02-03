"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, Lock, Lightbulb, ChevronDown, Copy, CheckIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function HintItem({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-slate-700 last:border-b-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left font-medium text-slate-300 hover:text-white transition-colors"
            >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="pb-4 text-slate-400">{children}</div>}
        </div>
    )
}

function PasswordCrackingLabContent() {
    const searchParams = useSearchParams()
    const challengeId = searchParams.get('challengeId')
    const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges"
    const backText = challengeId ? "Back to Challenge" : "Back to Challenges"

    const [flag, setFlag] = useState("")
    const [result, setResult] = useState<"success" | "error" | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)

    const HASH = "0c4f5f8fd16ab0b20a152fab22c3c11c"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/labs/password-cracking/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ flag }),
            })

            const data = await response.json()
            setResult(data.success ? "success" : "error")
        } catch {
            setResult("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(HASH)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={backHref}>
                        <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                            ← {backText}
                        </Button>
                    </Link>
                </div>

                <Card className="bg-slate-800 border-slate-700 mb-6">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                🔍 Miscellaneous
                            </Badge>
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                medium
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                25 pts
                            </Badge>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2">Password Cracking</h1>
                        <p className="text-slate-400 mb-6">
                            You have been given a password hash. Identify the hash type and recover the original password using online tools.
                        </p>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-slate-300">Password Hash:</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="text-slate-400"
                                >
                                    {copied ? (
                                        <>
                                            <CheckIcon className="h-4 w-4 mr-1" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="font-mono text-green-400 break-all text-lg">{HASH}</p>
                        </div>

                        <div className="border-t border-slate-700 pt-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                Techniques & Tools
                            </h2>
                            <p className="text-slate-400 text-sm mb-4">
                                Different hash algorithms such as MD5, SHA‑1, and SHA‑256 often have recognizable
                                patterns. Taking a moment to compare the given hash against common formats and
                                experimenting with online tools may help you narrow down which method was used
                                and recover the original value.
                            </p>
                            <p className="text-slate-400 text-sm mb-4">
                                Use these online tools to identify the hash type and crack it to find the password. Once you find the password, submit it in the format: <code className="bg-slate-700 px-2 py-1 rounded text-green-400">flag{"{password}"}</code>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
