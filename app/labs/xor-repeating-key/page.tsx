"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type MessageState = {
  type: "success" | "error";
  text: string;
};

const CIPHERTEXT_HEX =
  "051e18170f170c002602111f06130d191a083c191c092b0c11131a1b110b1e";
const EXPECTED_FLAG = "flag{xor_repeating_key_cracked}";

function xorDecrypt(hex: string, key: string): string {
  const normalizedHex = hex.replace(/[^0-9a-f]/gi, "");
  if (!normalizedHex || normalizedHex.length % 2 !== 0) {
    throw new Error("Invalid ciphertext");
  }
  if (!key) {
    throw new Error("Key required");
  }

  const bytes: number[] = [];
  for (let i = 0; i < normalizedHex.length; i += 2) {
    const byte = parseInt(normalizedHex.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) {
      throw new Error("Invalid ciphertext");
    }
    bytes.push(byte);
  }

  let result = "";
  for (let i = 0; i < bytes.length; i += 1) {
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(bytes[i] ^ keyChar);
  }
  return result;
}

export default function XorRepeatingKeyLab() {
  const [plaintextGuess, setPlaintextGuess] = useState("");
  const [keyGuess, setKeyGuess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [showFlag, setShowFlag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const handlePreview = () => {
    try {
      const decrypted = xorDecrypt(CIPHERTEXT_HEX, keyGuess);
      setPreview(decrypted);
      setPreviewError(null);
    } catch (error) {
      setPreview(null);
      setPreviewError((error as Error).message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!plaintextGuess.trim()) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/labs/xor-repeating-key/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plaintext: plaintextGuess,
          key: keyGuess,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        correct?: boolean;
        message?: string;
        flag?: string;
      } | null;

      if (!response.ok || !data) {
        setMessage({
          type: "error",
          text: data?.message ?? "Something went wrong.",
        });
        setShowFlag(false);
        return;
      }

      if (data.correct) {
        setMessage({
          type: "success",
          text: data.message ?? "✓ Correct decryption!",
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: "error",
          text: data.message ?? "✗ Incorrect plaintext.",
        });
        setShowFlag(false);
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
      setShowFlag(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/challenges"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Challenges
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🧮 Cryptography
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">
              XOR Encryption with Repeating Key
            </h1>
            <p className="text-slate-400 mb-6">
              The message below was encrypted using a repeating-key XOR cipher.
              Recover the plaintext and submit the flag hidden inside it.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">
                Ciphertext (hex):
              </h3>
              <p className="text-xs md:text-sm font-mono text-slate-200 break-all">
                {CIPHERTEXT_HEX}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Key guess
                </label>
                <Input
                  value={keyGuess}
                  onChange={(event) => setKeyGuess(event.target.value)}
                  placeholder="e.g. key"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
                <Button
                  type="button"
                  onClick={handlePreview}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                >
                  Generate preview
                </Button>
                {previewError && (
                  <p className="text-xs text-red-400">{previewError}</p>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-700 rounded p-4 min-h-[140px]">
                <p className="text-xs text-slate-400 mb-2">
                  Preview (using guessed key):
                </p>
                <p className="text-sm font-mono text-slate-200 whitespace-pre-wrap break-words">
                  {preview ?? "Provide a key guess and generate a preview."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Decrypted plaintext / flag
                </label>
                <Input
                  type="text"
                  value={plaintextGuess}
                  onChange={(event) => setPlaintextGuess(event.target.value)}
                  placeholder="flag{...}"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {submitting ? "Checking..." : "Submit plaintext"}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6 mt-6">
              <button
                onClick={() => setHintOpen((prev) => !prev)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {hintOpen ? "▼ Hide" : "▶ Show"} Hints
              </button>

              {hintOpen && (
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>
                    • Estimate the key length using repeating patterns and index
                    of coincidence.
                  </p>
                  <p>
                    • XOR the ciphertext with likely plaintext fragments such as
                    flag&#123; to reveal the key characters.
                  </p>
                  <p>
                    • Once you have the key, decrypt the full message to
                    retrieve the flag string.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag ? (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                🎉 Flag Recovered!
              </h2>
              <p className="text-slate-300 mb-4">
                Great work breaking the repeating-key XOR cipher.
              </p>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Flag:</p>
                <p className="font-mono text-green-400 text-lg break-all">
                  {EXPECTED_FLAG}
                </p>
              </div>
              <p className="text-sm text-slate-400">
                Copy the flag and submit it on the challenge page to earn
                points.
              </p>
            </div>
          </Card>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-8 space-y-4 text-sm text-slate-300">
              <h3 className="text-lg font-semibold text-white">
                💡 Repeating-Key XOR Refresher
              </h3>
              <p>
                Repeating-key XOR applies a short key cyclically across the
                plaintext. Each byte of the ciphertext is the XOR of a plaintext
                byte and one key character.
              </p>
              <p>
                To break the cipher, determine the key length, group the
                ciphertext by key positions, and apply frequency analysis.
                Guessing known plaintext snippets can also reveal the key
                quickly.
              </p>
              <p>
                Tools such as CyberChef, xortool, or custom scripts can
                accelerate the process once you have a strategy.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
