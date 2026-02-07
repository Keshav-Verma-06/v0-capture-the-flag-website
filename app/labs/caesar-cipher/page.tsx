"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CaesarCipherLab() {
  const [answer, setAnswer] = useState("");
  const [flag, setFlag] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const ENCRYPTED_TEXT = "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);
    setFlag(null);

    try {
      const res = await fetch("/api/labs/caesar-cipher/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      const data = (await res.json().catch(() => null)) as {
        correct?: boolean;
        message?: string;
        flag?: string;
      } | null;

      if (!res.ok || !data) {
        setMessage({
          type: "error",
          text: data?.message ?? "Something went wrong. Try again.",
        });
        return;
      }

      if (data.correct) {
        setMessage({ type: "success", text: data.message ?? "✓ Correct!" });
        setFlag(data.flag ?? null);
      } else {
        setMessage({
          type: "error",
          text: data.message ?? "✗ Incorrect. Try a different shift.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadChallengeId = async () => {
      const { data } = await supabase
        .from("challenges")
        .select("id")
        .eq("title", "Caesar Cipher")
        .maybeSingle();

      setChallengeId(data?.id ?? null);
    };

    loadChallengeId();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/challenges"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Challenges
          </Link>
        </div>

        <Card className="bg-slate-900/60 border border-slate-700 mb-6">
          <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <p className="text-white font-semibold">Problem page</p>
              <p className="text-slate-400 text-xs md:text-sm">
                Open the challenge to see full description and submit the flag.
              </p>
            </div>
            <Link
              href={challengeId ? `/challenges/${challengeId}` : "/challenges"}
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Open Problem
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                🔐 Cryptography
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">
              Caesar Cipher
            </h1>
            <p className="text-slate-400 mb-6">
              Decrypt this message encrypted with a Caesar cipher. The shift is
              between 1 and 15.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">
                Encrypted Text:
              </h3>
              <p className="text-sm font-mono text-slate-300 break-all">
                {ENCRYPTED_TEXT}
              </p>
            </div>

            <p className="text-slate-400 mb-4">
              The Caesar cipher is a simple substitution cipher where each
              letter is shifted by a fixed number of positions in the alphabet.
            </p>

            <h2 className="text-lg font-semibold text-white mb-4">
              Decrypt the message:
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Decrypted Text
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the decrypted message"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
              </div>

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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                {submitting ? "Checking..." : "Submit Answer"}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium px-0"
              >
                {showHint ? "▼ Hide" : "▶ Show"} Hints
              </Button>

              {showHint && (
                <div className="mt-4 space-y-3">
                  <p className="text-slate-300 text-sm">
                    Use a third-party Caesar cipher decoder to try shift values
                    1–15. Paste the encrypted text, then copy the plaintext
                    result into the answer box.
                  </p>

                  <p className="text-sm text-slate-400">
                    Suggested tools:{" "}
                    <a
                      href="https://www.dcode.fr/caesar-cipher"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      dCode
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://cryptii.com/pipes/caesar-cipher"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Cryptii
                    </a>
                    .
                  </p>

                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                    <li>Keep spaces/punctuation the same</li>
                    <li>Only A–Z / a–z letters are shifted</li>
                    <li>
                      When it becomes readable English, you found the right
                      shift
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>

        {flag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                🎉 Decryption Successful!
              </h2>
              <p className="text-slate-300 mb-4">
                You successfully decrypted the Caesar cipher!
              </p>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Flag:</p>
                <p className="font-mono text-green-400 text-lg break-all">
                  {flag}
                </p>
              </div>
              <p className="text-sm text-slate-400">
                Copy the flag above and submit it in the challenge page to earn
                points!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
