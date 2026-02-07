"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

/* PSEUDOCODE SHOWN TO USER — NOT RUNNABLE */
const PSEUDOCODE = `
Pseudocode:

data = [19, 10, 11, 52, 12, 10, 52, 22, 16, 6, 21, 21, 14]
key = "key"

for i from 0 to length(data) - 1:
    decoded_char = data[i] XOR ASCII(key[i mod length(key)])
    append decoded_char to output

print output
`;

export default function ObfuscatedCodeLab() {
  const [answer, setAnswer] = useState("");
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] =
    useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  /* ONLY VALID ANSWER */
  const EXPECTED_ANSWER = "xor_is_simple";

  /* REAL CTF FLAG (SUBMIT ON PORTAL) */
  const FLAG = "flag{deobfuscated_code}";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim() === EXPECTED_ANSWER) {
        setMessage({
          type: "success",
          text: "✓ Correct! You successfully reversed the obfuscated logic.",
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: "error",
          text: "✗ Incorrect. Implement the pseudocode carefully.",
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/challenges" className="text-blue-400 hover:text-blue-300">
            ← Back to Challenges
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                MEDIUM
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🔬 Reverse Engineering
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">
              Obfuscated Code Lab
            </h1>

            <p className="text-slate-400 mb-6">
              The logic below is intentionally obfuscated. Implement it in any
              programming language and recover the hidden message.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">
                Obfuscated Logic:
              </h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {PSEUDOCODE}
              </pre>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">
              Enter the decoded value:
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="decoded_message_here"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={submitting}
              />

              {message && (
                <div
                  className={`p-4 rounded-md border ${
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <p
                    className={
                      message.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {message.text}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Checking..." : "Submit Answer"}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? "▼ Hide" : "▶ Show"} Hint
              </button>

              {showHint && (
                <div className="mt-4 bg-slate-700 rounded p-4 space-y-2">
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 1:</strong> XOR is reversible.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 2:</strong> Convert characters to ASCII before XOR.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 3:</strong> The key repeats using modulo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                🎉 Challenge Solved!
              </h2>
              <p className="font-mono text-green-400 text-lg">{FLAG}</p>
              <p className="text-slate-400 mt-2 text-sm">
                Submit this flag on the challenge page.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
