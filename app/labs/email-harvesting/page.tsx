'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

function EmailHarvestingLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';

  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [harvestedEmails, setHarvestedEmails] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState<string | null>(null);

  /* =========================
     OSINT CONFIG (NOT SHOWN)
     ========================= */

  const targetDomain = 'techcorp.com';

  const publicSources = {
    website: ['info@techcorp.com', 'contact@techcorp.com'],
    jobs: ['careers@techcorp.com', 'hr@techcorp.com'],
    mailingLists: ['admin@techcorp.com', 'security@techcorp.com'],
  };

  const decoyEmails = [
    'support@techcorp-support.com',
    'admin@techcorp.co',
    'info@gmail.com',
  ];

  const requiredValidCount = 5;

  /* =========================
     HARVEST LOGIC
     ========================= */

  const handleHarvest = () => {
    if (!domainInput.trim()) {
      setMessage('Please enter a domain name');
      return;
    }

    setLoading(true);
    setMessage('');

    setTimeout(() => {
      const normalizedDomain = domainInput
        .toLowerCase()
        .replace(/^www\./, '')
        .trim();

      if (normalizedDomain !== targetDomain) {
        setHarvestedEmails([]);
        setMessage(`No public data sources found for ${domainInput}`);
        setFlag(null);
        setLoading(false);
        return;
      }

      // Pick a random public source (simulates OSINT scraping)
      const sourceKeys = Object.keys(publicSources) as Array<
        keyof typeof publicSources
      >;
      const randomSource =
        sourceKeys[Math.floor(Math.random() * sourceKeys.length)];

      const newEmails = [
        ...publicSources[randomSource],
        ...decoyEmails,
      ];

      const mergedEmails = Array.from(
        new Set([...harvestedEmails, ...newEmails])
      );

      setHarvestedEmails(mergedEmails);

      // Validate emails (user is expected to notice this rule)
      const validEmails = mergedEmails.filter((email) =>
        email.endsWith(`@${targetDomain}`)
      );

      setMessage(
        `Discovered ${newEmails.length} emails from public ${randomSource} sources. 
Valid organizational emails identified: ${validEmails.length}/${requiredValidCount}`
      );

      // Generate flag only when harvesting is complete
      if (validEmails.length >= requiredValidCount) {
        const generatedFlag = `flag{emails_harvested}`;
        setFlag(generatedFlag);
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

          {/* Header */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
          
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                Medium
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                25 pts
              </Badge>
            </div>
              <CardTitle className="text-3xl text-white">Email Harvesting Lab</CardTitle>
              <CardDescription className="text-slate-400">
                Identify and collect publicly exposed email addresses belonging to a target organization
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Objective */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Objective</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-3">
              <p>
                Use simulated OSINT techniques to harvest email addresses from public sources such as
                websites, job listings, and mailing lists.
              </p>
              <p>
                Not all discovered emails are relevant. Carefully identify which addresses truly belong
                to the target organization.
              </p>
              <p className="text-slate-400 text-sm">
                © 2024 TechCorp IT Services — Internal Security Training
              </p>
             
            </CardContent>
          </Card>

          {/* Harvester */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Email Harvester Tool</CardTitle>

            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-slate-400 text-sm">
               Results may vary between harvest attempts due to different public data sources being indexed.
              </p>
              <div className="flex gap-2">
                
                <Input
                  placeholder="Enter organization domain"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleHarvest()}
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <Button
                  onClick={handleHarvest}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Harvesting…' : 'Harvest'}
                </Button>
              </div>

              {message && (
                <div className="p-3 text-sm rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {message}
                </div>
              )}

              {harvestedEmails.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h3 className="text-sm text-slate-300 font-semibold">
                    Discovered Email Addresses:
                  </h3>
                  {harvestedEmails.map((email, i) => (
                    <div
                      key={i}
                      className="font-mono text-sm bg-slate-900 border border-slate-700 rounded p-2 text-slate-300"
                    >
                      {email}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flag */}
          {flag && (
            <Card className="bg-gradient-to-r from-green-900 to-green-800 border-green-700">
              <CardHeader>
                <CardTitle className="text-green-300 text-2xl">🚩 Flag Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono bg-slate-900 p-4 rounded border border-green-600 text-green-400 break-all">
                  {flag}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </main>
  );
}

export default function EmailHarvestingLab() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-slate-400">Loading…</div>}>
      <EmailHarvestingLabContent />
    </Suspense>
  );
}
