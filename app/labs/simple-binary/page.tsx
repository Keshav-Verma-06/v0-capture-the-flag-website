'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SimpleBinaryLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{binary_analyzed}';
  const CORRECT_FLAG = 'binary_secret_code';

  const BINARY_HEX = '62 69 6e 61 72 79 5f 73 65 63 72 65 74 5f 63 6f 64 65';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim().toLowerCase() === CORRECT_FLAG) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You extracted the embedded string from the binary!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Try converting the hex values to ASCII.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  const downloadBinary = () => {
    const hexString = BINARY_HEX.replace(/\s/g, '');
    const bytes = new Uint8Array(
      hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'binary_sample';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🔬 Reverse Engineering
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Simple Binary Analysis</h1>
            <p className="text-slate-400 mb-6">
              You have obtained a binary file. Analyze it to extract the hidden flag.
            </p>

            <p className="text-slate-400 mb-6">
              The binary contains an embedded string. Your task is to find and extract it.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Hexdump (strings section):</h3>
              <p className="text-xs font-mono text-slate-300 break-all">{BINARY_HEX}</p>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Extract the Hidden String:</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Extracted String
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the extracted string"
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

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {submitting ? 'Checking...' : 'Submit Answer'}
                </Button>
                <Button
                  type="button"
                  onClick={downloadBinary}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2"
                >
                  📥 Download Binary
                </Button>
              </div>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? '▼ Hide' : '▶ Show'} Hint
              </button>

              {showHint && (
                <div className="mt-4 bg-slate-700 rounded p-4 space-y-3">
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 1:</strong> The hexadecimal values represent ASCII characters.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 2:</strong> Use an online converter or Python to convert hex to ASCII.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Python example:</strong>
                  </p>
                  <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-300">
                    bytes.fromhex('62 69 6e ... 64 65').decode('ascii')
                  </div>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 3:</strong> The result should be readable text.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Binary Analysis Complete!</h2>
              <p className="text-slate-300 mb-4">
                You successfully extracted the hidden string from the binary!
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
              <h3 className="text-lg font-semibold text-white mb-4">💡 Binary Analysis</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  Binary analysis involves examining compiled code to understand its behavior, often using tools like:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Disassemblers:</strong> IDA Pro, Ghidra, objdump</li>
                  <li><strong>Debuggers:</strong> GDB, WinDbg, Radare2</li>
                  <li><strong>Hex editors:</strong> HxD, xxd</li>
                  <li><strong>String extractors:</strong> strings command</li>
                </ul>
                <p>
                  Common techniques include looking for hardcoded strings, API calls, and control flow patterns.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SimpleBinaryLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SimpleBinaryLabContent />
    </Suspense>
  );
}
