'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CSRFLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [currentEmail, setCurrentEmail] = useState('user@example.com');
  const [newEmail, setNewEmail] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{csrf_protected}';

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setSubmitting(true);
    setMessage(null);

    // VULNERABLE: No CSRF token validation
    // In a real scenario, this would be a POST request without CSRF token

    setTimeout(() => {
      // Simulate successful email change without CSRF protection
      setCurrentEmail(newEmail);
      setMessage({
        type: 'success',
        text: '✓ Email changed successfully! (No CSRF protection)',
      });
      setNewEmail('');
      setShowFlag(true);
      setSubmitting(false);
    }, 500);
  };

  const simulateExternalAttack = () => {
    // Simulate an external site making a request to change email
    setMessage({
      type: 'success',
      text: '✓ External request intercepted! CSRF vulnerability demonstrated.',
    });
    setCurrentEmail('attacker@evil.com');
    setShowFlag(true);
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

            <h1 className="text-4xl font-bold text-white mb-2">CSRF Attack</h1>
            <p className="text-slate-400 mb-6">
              This application is vulnerable to Cross-Site Request Forgery. Try changing the email without proper CSRF protection.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Vulnerable Endpoint:</h3>
              <p className="text-xs font-mono text-slate-300">
                POST /api/change-email (No CSRF Token Required)
              </p>
            </div>

            <h2 className="text-lg font-semibold text-white mb-6">Your Account</h2>

            <div className="bg-slate-700 border border-slate-600 rounded p-4 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Current Email:</p>
                  <p className="text-white font-mono">{currentEmail}</p>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Change Email:</h2>

            <form onSubmit={handleChangeEmail} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Email
                </label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Notice: No CSRF token is required!
                </p>
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
                {submitting ? 'Changing...' : 'Change Email'}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Simulate External Attack</h3>
              <p className="text-slate-400 mb-4">
                Click below to simulate an attacker's website making a request to change your email:
              </p>
              <Button
                onClick={simulateExternalAttack}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
              >
                🚀 Trigger CSRF Attack
              </Button>
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 CSRF Vulnerability Exploited!</h2>
              <p className="text-slate-300 mb-4">
                You successfully demonstrated a CSRF vulnerability. Email was changed without proper authentication!
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
              <h3 className="text-lg font-semibold text-white mb-4">💡 Understanding CSRF</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  Cross-Site Request Forgery (CSRF) occurs when an attacker tricks a user into performing an action on a website where they are authenticated.
                </p>
                <p>
                  How CSRF works:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>User logs into their bank account</li>
                  <li>User visits a malicious website (attacker's site)</li>
                  <li>Malicious site makes a request to the bank (transfer money, change email, etc.)</li>
                  <li>Request succeeds because user is still authenticated</li>
                </ul>
                <p>
                  <strong>Protection:</strong> CSRF tokens ensure that requests come from legitimate forms on the website.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function CSRFLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <CSRFLabContent />
    </Suspense>
  );
}
