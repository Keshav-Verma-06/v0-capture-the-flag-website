'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CaesarCipherLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const FLAG = 'flag{caesar_shift3}';
  const ENCRYPTED_TEXT = 'Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj';
  const DECRYPTED_TEXT = 'The quick brown fox jumps over the lazy dog';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim().toLowerCase() === DECRYPTED_TEXT.toLowerCase()) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You decrypted the Caesar cipher!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Try decrypting the text with different shift values.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  const generateShiftOptions = () => {
    const shifts = [];
    for (let i = 1; i <= 25; i++) {
      let shifted = '';
      for (let char of ENCRYPTED_TEXT) {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          shifted += String.fromCharCode(((code - base - i + 26) % 26) + base);
        } else {
          shifted += char;
        }
      }
      shifts.push({ shift: i, text: shifted });
    }
    return shifts;
  };

  const shifts = generateShiftOptions();

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

            <h1 className="text-4xl font-bold text-white mb-2">Caesar Cipher</h1>
            <p className="text-slate-400 mb-6">
              Decrypt this message encrypted with a Caesar cipher.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Encrypted Text:</h3>
              <p className="text-sm font-mono text-slate-300 break-all">{ENCRYPTED_TEXT}</p>
            </div>

            <p className="text-slate-400 mb-4">
              The Caesar cipher is a simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.
            </p>

            <h2 className="text-lg font-semibold text-white mb-4">Decrypt the message:</h2>

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

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? '▼ Hide' : '▶ Show'} Caesar Shift Reference
              </button>

              {showHint && (
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-slate-400 text-sm mb-3">
                    Try each shift value to find the correct decryption:
                  </p>
                  <div className="space-y-2">
                    {shifts.map((s) => (
                      <div key={s.shift} className="bg-slate-700 rounded p-2 text-xs">
                        <span className="text-slate-400">Shift {s.shift}:</span>
                        <span className="text-slate-300 ml-2 font-mono break-all">{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Decryption Successful!</h2>
              <p className="text-slate-300 mb-4">
                You successfully decrypted the Caesar cipher!
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
      </div>
    </div>
  );
}

export default function CaesarCipherLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <CaesarCipherLabContent />
    </Suspense>
  );
}
