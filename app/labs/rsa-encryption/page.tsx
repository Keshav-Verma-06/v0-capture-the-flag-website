"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function RSAEncryptionLab() {
  const [plaintext, setPlaintext] = useState("");
  const [showFlag, setShowFlag] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = "flag{rsa_broken}";
  const CORRECT_PLAINTEXT = "HELLO";

  const PUBLIC_KEY_N = "3233";
  const PUBLIC_KEY_E = "65537";

  // HELLO encrypted character-by-character
  const CIPHERTEXT = "[3000, 1313, 2726, 2726, 1307]";

  // Math reference (correct)
  // p = 61, q = 53
  // φ(n) = (61 − 1)(53 − 1) = 3120
  // e = 65537 ≡ 17 (mod 3120)
  // d = 2753

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plaintext.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (plaintext.trim().toUpperCase() === CORRECT_PLAINTEXT) {
        setMessage({
          type: "success",
          text: "✓ Correct! RSA decryption successful.",
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: "error",
          text: "✗ Incorrect. Decrypt each ciphertext block and convert to ASCII.",
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  useEffect(() => {
    const loadChallengeId = async () => {
      const { data } = await supabase
        .from("challenges")
        .select("id")
        .eq("title", "RSA Encryption")
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
              RSA Encryption
            </h1>

            <p className="text-slate-400 mb-6">
              You have intercepted an RSA-encrypted message. Decrypt it using
              the public key provided.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded p-4">
                <h3 className="text-sm font-mono text-green-400 mb-2">
                  Public Key (n, e)
                </h3>
                <p className="text-sm font-mono text-slate-300">
                  n = {PUBLIC_KEY_N}
                </p>
                <p className="text-sm font-mono text-slate-300">
                  e = {PUBLIC_KEY_E}
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded p-4">
                <h3 className="text-sm font-mono text-green-400 mb-2">
                  Ciphertext (blocks)
                </h3>
                <p className="text-sm font-mono text-slate-300">{CIPHERTEXT}</p>
              </div>
            </div>

            <p className="text-slate-400 mb-4">
              This RSA key uses weak parameters. Follow these steps:
            </p>

            <ul className="list-disc list-inside text-slate-400 text-sm space-y-2 mb-6">
              <li>Factor the modulus: n = p × q</li>
              <li>Compute φ(n) = (p − 1)(q − 1)</li>
              <li>Find d such that e × d ≡ 1 (mod φ(n))</li>
              <li>
                Decrypt each block using: m = c<sup>d</sup> mod n
              </li>
              <li>Convert numeric results to ASCII</li>
            </ul>

            <h2 className="text-lg font-semibold text-white mb-4">
              Enter the Plaintext
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <Input
                type="text"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter decrypted plaintext"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                {submitting ? "Checking..." : "Submit Answer"}
              </Button>
            </form>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                RSA Decryption Successful
              </h2>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4">
                <p className="font-mono text-green-400 text-lg">{FLAG}</p>
              </div>
            </div>
          </Card>
        )}

        {!showFlag && (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                💡 RSA Background
              </h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  RSA is a public-key cryptosystem based on the difficulty of
                  factoring large integers.
                </p>

                <p className="font-medium">Core formulas:</p>

                <p>
                  Encryption: c = m<sup>e</sup> mod n
                </p>
                <p>
                  Decryption: m = c<sup>d</sup> mod n
                </p>

                <p>
                  In this challenge, the modulus is small, making RSA breakable.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
