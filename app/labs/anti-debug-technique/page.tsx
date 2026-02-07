"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const CODE = `
#include <stdio.h>
#include <time.h>

int dbg = 0;

long now() {
    return clock();
}

void check_env() {
    long t0 = now();
    volatile int i;
    for (i = 0; i < 1000000; i++);
    long t1 = now();

    if ((t1 - t0) > 100)
        dbg = 1;
}

int allowed() {
    if (dbg)
        return 0;
    return 1;
}

void run() {
    if (!allowed()) {
        puts("access_denied");
        return;
    }

    char out[] = {
        98,121,112,97,115,115,95,
        116,104,101,95,
        99,104,101,99,107,115,0
    };

    puts(out);
}

int main() {
    check_env();
    run();
    return 0;
}
`;

export default function AntiDebugLab() {
  const [answer, setAnswer] = useState("");
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] =
    useState<{ type: "success" | "error"; text: string } | null>(null);

  const EXPECTED = "bypass_the_checks";
  const FLAG = "flag{debugger_bypass}";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answer.trim() === EXPECTED) {
      setMessage({
        type: "success",
        text: "✓ Correct. Anti-debug logic bypassed.",
      });
      setShowFlag(true);
    } else {
      setMessage({
        type: "error",
        text: "✗ Incorrect. The real output is not the obvious one.",
      });
      setShowFlag(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/challenges" className="text-blue-400 hover:text-blue-300">
            ← Back to Challenges
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex gap-3 mb-4">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                HARD
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🔬 Reverse Engineering
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Anti-Debug Technique
            </h1>

            <p className="text-slate-400 mb-6">
              The program below hides its real behavior using environmental checks.
              Analyze, modify, and execute it to recover the hidden output.
            </p>

            <pre className="bg-slate-900/60 border border-slate-700 rounded p-4 text-xs font-mono text-green-400 mb-6 overflow-x-auto">
              {CODE}
            </pre>

            <h2 className="text-white text-lg mb-2">
              Enter the recovered output:
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="recovered_text_here"
                className="bg-slate-700 border-slate-600 text-white"
              />

              {message && (
                <div
                  className={`p-3 rounded border ${
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Submit Answer
              </Button>
            </form>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-6">
              <p className="text-green-400 font-mono text-lg">{FLAG}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
