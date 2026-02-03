'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function RSAEncryptionLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [plaintext, setPlaintext] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{rsa_broken}';
  const CORRECT_PLAINTEXT = 'HELLO';
  const PUBLIC_KEY_N = '3233';
  const PUBLIC_KEY_E = '65537';
  const CIPHERTEXT = '2790';

  // For demonstration: n=61*53=3233, e=65537
  // To decrypt: find private key d such that (e*d) mod φ(n) = 1
  // φ(3233) = (61-1)*(53-1) = 2880
  // d = 2753

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plaintext.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (plaintext.trim().toUpperCase() === CORRECT_PLAINTEXT) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You found the plaintext!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Try using the public key to factor the modulus or use known weak parameters.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
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
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                🔐 Cryptography
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">RSA Encryption</h1>
            <p className="text-slate-400 mb-6">
              You have intercepted an RSA-encrypted message. Decrypt it using the public key provided.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded p-4">
                <h3 className="text-sm font-mono text-green-400 mb-2">Public Key (n, e):</h3>
                <p className="text-sm font-mono text-slate-300">
                  n = {PUBLIC_KEY_N}
                </p>
                <p className="text-sm font-mono text-slate-300">
                  e = {PUBLIC_KEY_E}
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded p-4">
                <h3 className="text-sm font-mono text-green-400 mb-2">Ciphertext:</h3>
                <p className="text-sm font-mono text-slate-300">{CIPHERTEXT}</p>
              </div>
            </div>

            <p className="text-slate-400 mb-4">
              This RSA key uses small parameters that can be broken. Try to:
            </p>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-2 mb-6">
              <li>Factor the modulus (n) to find the primes p and q</li>
              <li>Calculate φ(n) = (p-1) * (q-1)</li>
              <li>Find the private key d using the extended Euclidean algorithm</li>
              <li>Decrypt: plaintext = ciphertext^d mod n</li>
            </ul>

            <h2 className="text-lg font-semibold text-white mb-4">Enter the Plaintext:</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Plaintext
                </label>
                <Input
                  type="text"
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter the decrypted plaintext"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <p
                    className={
                      message.type === 'success'
                        ? 'text-green-400'
                        : 'text-red-400'
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
                {submitting ? 'Checking...' : 'Submit Answer'}
              </Button>
            </form>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 RSA Decryption Successful!</h2>
              <p className="text-slate-300 mb-4">
                You successfully broke the RSA encryption and found the plaintext!
              </p>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Flag:</p>
                <p className="font-mono text-green-400 text-lg break-all">{FLAG}</p>
              </div>
              <p className="text-sm text-slate-400">
                Copy the flag above and submit it in the challenge page to earn points!
              </p>
            </div>
          </Card>
        )}

        {!showFlag && (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-white mb-4">💡 RSA Background</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  RSA (Rivest–Shamir–Adleman) is a public-key cryptosystem widely used for secure data transmission.
                </p>
                <p>
                  <strong>How RSA encryption works:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Generate two large prime numbers p and q</li>
                  <li>Calculate n = p * q</li>
                  <li>Calculate φ(n) = (p-1) * (q-1)</li>
                  <li>Choose e such that 1 &lt; e &lt; φ(n)</li>
                  <li>Calculate d such that (e*d) mod φ(n) = 1</li>
                  <li>Public key: (n, e), Private key: (n, d)</li>
                </ul>
                <p>
                  Encryption: c = m^e mod n
                </p>
                <p>
                  Decryption: m = c^d mod n
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function RSAEncryptionLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <RSAEncryptionLabContent />
    </Suspense>
  );
}
