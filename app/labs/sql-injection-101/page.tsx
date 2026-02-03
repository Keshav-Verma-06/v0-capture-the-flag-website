'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SQLInjectionLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showFlag, setShowFlag] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{sql_inj3ct1on}';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // VULNERABLE CODE: Simulating unsafe SQL query construction
    // In real scenario: SELECT * FROM users WHERE username='${username}' AND password='${password}'
    
    // Check for SQL injection patterns
    const sqlInjectionPatterns = [
      "' OR '1'='1",
      "admin' OR '1'='1",
      "' OR 1=1",
      "admin' --",
      "' OR 'a'='a",
      "admin' /*",
    ];

    const isSQLInjection = sqlInjectionPatterns.some(pattern =>
      username.toLowerCase().includes(pattern.toLowerCase()) ||
      password.toLowerCase().includes(pattern.toLowerCase())
    );

    // Simulate a small delay for UI feedback
    setTimeout(() => {
      if (isSQLInjection) {
        setMessage({
          type: 'success',
          text: '✓ SQL Injection detected! Authentication bypassed!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Authentication failed. Credentials are invalid.',
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
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                ⚠️ Intentionally Vulnerable
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">SQL Injection 101</h1>
            <p className="text-slate-400 mb-6">
              This lab simulates a vulnerable login form. Try to bypass authentication using SQL injection.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Vulnerable Query:</h3>
              <p className="text-xs font-mono text-slate-300">
                SELECT * FROM users WHERE username='{'{username}'}' AND password='{'{password}'}'
              </p>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Try to bypass authentication:</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Hint: Try entering a payload like: admin' OR '1'='1
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
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
                {submitting ? 'Checking...' : 'Login'}
              </Button>
            </form>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Success!</h2>
              <p className="text-slate-300 mb-4">
                You successfully exploited the SQL injection vulnerability. The authentication was bypassed!
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
              <h3 className="text-lg font-semibold text-white mb-4">💡 Understanding SQL Injection</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  SQL Injection occurs when user input is directly concatenated into SQL queries without proper sanitization.
                </p>
                <p>
                  Common payloads include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>admin' OR '1'='1' -- (bypasses password check)</li>
                  <li>' OR 1=1 -- (always true condition)</li>
                  <li>admin' /* (comment out the rest of query)</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SQLInjectionLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SQLInjectionLabContent />
    </Suspense>
  );
}
