'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function EmailHarvestingLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flagFound, setFlagFound] = useState(false);
  const [harvestedEmails, setHarvestedEmails] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const targetDomain = 'techcorp.io';
  const correctEmails = ['admin@techcorp.io', 'contact@techcorp.io', 'info@techcorp.io', 'support@techcorp.io', 'security@techcorp.io'];
  const flag = 'flag{emails_harvested}';

  const handleHarvest = async () => {
    if (!domainInput.trim()) {
      setMessage('Please enter a domain name');
      return;
    }

    setLoading(true);
    setMessage('');

    // Simulate API call to harvest emails
    setTimeout(() => {
      if (domainInput.toLowerCase() === targetDomain) {
        const foundEmails = correctEmails;
        setHarvestedEmails(foundEmails);
        setMessage(`Successfully harvested ${foundEmails.length} email addresses!`);
        setFlagFound(true);
      } else {
        setHarvestedEmails([]);
        setMessage(`No emails found for domain: ${domainInput}`);
        setFlagFound(false);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={backHref}>
          <Button variant="outline" className="mb-6 border-slate-600 text-slate-200 hover:bg-slate-800">
            ← {backText}
          </Button>
        </Link>

        <div className="grid gap-8">
          {/* Lab Header */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl text-white">Email Harvesting Lab</CardTitle>
              <CardDescription className="text-slate-400">
                Learn to find email addresses associated with a domain using OSINT techniques
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Instructions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Objective</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                Email harvesting is an OSINT technique used to find email addresses associated with a target domain. These addresses are gathered from publicly available sources like:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Search engine caches</li>
                <li>Public mailing lists</li>
                <li>Domain registration databases</li>
                <li>Social media profiles</li>
                <li>Job postings and LinkedIn</li>
              </ul>
              <p className="pt-4 font-semibold text-blue-400">
                Try entering the domain: <code className="bg-slate-900 px-2 py-1 rounded">techcorp.io</code>
              </p>
            </CardContent>
          </Card>

          {/* Harvesting Tool */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Email Harvester Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300">Enter Target Domain:</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., techcorp.io"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleHarvest()}
                    className="flex-1 bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                  />
                  <Button
                    onClick={handleHarvest}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Harvesting...' : 'Harvest Emails'}
                  </Button>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-3 rounded text-sm ${
                    flagFound
                      ? 'bg-green-900 text-green-300 border border-green-700'
                      : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Harvested Emails Display */}
              {harvestedEmails.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-slate-300">Harvested Email Addresses:</h3>
                  <div className="space-y-2">
                    {harvestedEmails.map((email, index) => (
                      <div
                        key={index}
                        className="bg-slate-900 p-3 rounded border border-slate-700 text-slate-300 font-mono text-sm"
                      >
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flag Display */}
          {flagFound && (
            <Card className="bg-gradient-to-r from-green-900 to-green-800 border-green-700">
              <CardHeader>
                <CardTitle className="text-2xl text-green-300">🚩 Flag Found!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded border border-green-600 font-mono text-lg text-green-400 break-all">
                  {flag}
                </div>
                <p className="text-green-200 text-sm mt-3">
                  Submit this flag on the challenge page to earn points!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips & Techniques */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Real-World Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300 text-sm">
              <p>
                <strong className="text-slate-200">Hunter.io:</strong> Finds professional email addresses associated with domains
              </p>
              <p>
                <strong className="text-slate-200">Clearbit:</strong> Provides email lists and company data
              </p>
              <p>
                <strong className="text-slate-200">RocketReach:</strong> Gathers email addresses and contact information
              </p>
              <p>
                <strong className="text-slate-200">TheHarvester:</strong> Python tool that aggregates emails from multiple sources
              </p>
              <p className="pt-2 border-t border-slate-700 text-yellow-300">
                ⚠️ Always ensure you have authorization before conducting email harvesting or reconnaissance on any domain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function EmailHarvestingLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <EmailHarvestingLabContent />
    </Suspense>
  );
}
