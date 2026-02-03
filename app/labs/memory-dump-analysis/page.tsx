'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function MemoryDumpLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{memory_extracted}';
  const CORRECT_PASSWORD = 'SecurePassword2024';

  const MEMORY_DUMP = `
0x7fff5fbff000: 48 69 64 64 65 6e 50 61 73 73 77 6f 72 64 3a 20 | HiddenPassword:
0x7fff5fbff010: 53 65 63 75 72 65 50 61 73 73 77 6f 72 64 32 30 | SecurePassword20
0x7fff5fbff020: 32 34 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | 24..............
0x7fff5fbff030: 41 64 6d 69 6e 55 73 65 72 6e 61 6d 65 3a 20 61 | AdminUsername: a
0x7fff5fbff040: 64 6d 69 6e 40 65 78 61 6d 70 6c 65 2e 63 6f 6d | dmin@example.com
  `;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim() === CORRECT_PASSWORD) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You extracted the password from memory!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Analyze the memory dump and look for readable strings.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  const downloadMemoryDump = () => {
    const content = MEMORY_DUMP;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'memory_dump.txt';
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
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                🔍 Forensics
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Memory Dump Analysis</h1>
            <p className="text-slate-400 mb-6">
              A memory dump from a compromised system has been obtained. Extract the hidden credentials.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-mono text-green-400 mb-2">Memory Dump (Hexdump Format):</h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-words">
                {MEMORY_DUMP}
              </pre>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Find the Password:</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the extracted password"
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
                  onClick={downloadMemoryDump}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2"
                >
                  📥 Download Dump
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
                    <strong>Hint:</strong> Look for ASCII strings in the hexdump. The memory dump shows both hex values and their ASCII representation on the right.
                  </p>
                  <p className="text-slate-300 text-sm">
                    Read the ASCII side of the dump (right column) to find readable text like passwords, usernames, and other sensitive information.
                  </p>
                  <p className="text-slate-300 text-sm">
                    Common tools for memory analysis: volatility, strings command, Rekall, or manual hexdump analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Credentials Found!</h2>
              <p className="text-slate-300 mb-4">
                You successfully extracted the password from the memory dump!
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
              <h3 className="text-lg font-semibold text-white mb-4">💡 Memory Forensics</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  Memory dumps capture the entire contents of system RAM at a point in time. They often contain:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Passwords and credentials</strong> in plaintext</li>
                  <li><strong>Unencrypted data</strong> from running applications</li>
                  <li><strong>Keys and tokens</strong> used for authentication</li>
                  <li><strong>Browsing history</strong> and search queries</li>
                  <li><strong>Sensitive files</strong> and documents</li>
                </ul>
                <p>
                  Memory forensics tools like Volatility can extract detailed information from dumps for incident investigation.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MemoryDumpLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <MemoryDumpLabContent />
    </Suspense>
  );
}
