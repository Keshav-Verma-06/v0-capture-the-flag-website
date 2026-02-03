"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, ImageIcon, Lightbulb, Download, ChevronDown } from "lucide-react"
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

function SteganographyLabContent() {
  const searchParams = useSearchParams()
  const challengeId = searchParams.get('challengeId')
  const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges"
  const backText = challengeId ? "Back to Challenge" : "Back to Challenges"

  const [flag, setFlag] = useState("")
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/labs/steganography/verify", {
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
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Easy
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                10 pts
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Steganography</h1>
            <p className="text-slate-400 mb-6">
              An image contains a hidden message. Extract it to find the flag.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 mb-6 text-center">
              <div className="mb-6">
                <img
                  src="/challenges/steganography/secret_image.png"
                  alt="Challenge image containing hidden flag"
                  className="w-full max-w-md mx-auto rounded-lg border border-slate-600"
                />
              </div>
              <a href="/challenges/steganography/secret_image.png" download="secret_image.png">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </a>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Hints & Techniques
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                This hint suggests that the image may contain hidden information, so try checking for embedded text, examining metadata, or using basic steganography techniques like LSB analysis or simple extraction tools. Online analyzers such as Aperi&apos;Solve, CyberChef, FotoForensics, and <a href="https://www.devglan.com/online-tools/image-steganography-online" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 hover:text-yellow-400 italic">Devglan</a> may help you uncover what&apos;s hidden.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function SteganographyLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SteganographyLabContent />
    </Suspense>
  );
}
