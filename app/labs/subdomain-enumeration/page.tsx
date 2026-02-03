'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SubdomainEnumerationLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [flagFound, setFlagFound] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Simulated subdomain database
  const subdomainDatabase: { [key: string]: string[] } = {
    'example.com': [
      'www.example.com',
      'mail.example.com',
      'ftp.example.com',
      'admin.example.com',
      'api.example.com',
      'dev.example.com',
      'flag{subdomains_found}.example.com',
    ],
    'ctf-event.com': [
      'www.ctf-event.com',
      'api.ctf-event.com',
      'admin.ctf-event.com',
      'dashboard.ctf-event.com',
      'staging.ctf-event.com',
      'flag{subdomains_found}.ctf-event.com',
      'secret.ctf-event.com',
    ],
    'vulnerable.io': [
      'www.vulnerable.io',
      'mail.vulnerable.io',
      'ftp.vulnerable.io',
      'admin.vulnerable.io',
      'backup.vulnerable.io',
      'flag{subdomains_found}.vulnerable.io',
    ],
  };

  const handleEnumerate = async () => {
    const domainLower = domain.toLowerCase().trim();

    if (!domainLower) {
      setResults(['Please enter a domain name to enumerate.']);
      return;
    }

    setIsScanning(true);

    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (subdomainDatabase[domainLower]) {
      const subs = subdomainDatabase[domainLower];
      setResults(subs);

      // Check if flag is found
      const flagSubdomain = subs.find((s) =>
        s.includes('flag{subdomains_found}')
      );
      if (flagSubdomain) {
        setFlagFound(true);
      }
    } else {
      setResults([
        `No subdomains found for "${domainLower}". Try: example.com, ctf-event.com, or vulnerable.io`,
      ]);
    }

    setIsScanning(false);
  };

  const handleReset = () => {
    setDomain('');
    setResults([]);
    setFlagFound(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={backHref}>
            <Button variant="outline" className="mb-4 border-slate-600 text-slate-200 hover:bg-slate-800">
              ← {backText}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Subdomain Enumeration Lab</h1>
          <p className="text-slate-300">
            Discover hidden subdomains using OSINT techniques
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                Subdomain Enumeration Scanner
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Domain
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isScanning) handleEnumerate();
                    }}
                    disabled={isScanning}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleEnumerate}
                    disabled={isScanning}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isScanning ? 'Scanning...' : 'Enumerate Subdomains'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 bg-transparent"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {results.length > 0 && (
                <div className="mt-6 p-4 bg-slate-700 rounded border border-slate-600">
                  <h3 className="font-semibold mb-3 text-blue-300">
                    Found {results.length} Subdomain{results.length !== 1 ? 's' : ''}:
                  </h3>
                  <ul className="space-y-2">
                    {results.map((sub, idx) => (
                      <li key={idx} className="text-sm text-slate-200">
                        <span className="text-green-400">→</span> {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {flagFound && (
                <div className="mt-6 p-4 bg-green-900 border border-green-600 rounded">
                  <p className="text-green-100 font-semibold">
                    ✓ Flag Found! Look for the subdomain containing the flag.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Techniques
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <strong>Brute Force:</strong> Try common subdomain names like
                  www, mail, ftp, admin.
                </li>
                <li>
                  <strong>Certificate Search:</strong> Check SSL certificates
                  for domain names.
                </li>
                <li>
                  <strong>DNS Records:</strong> Query DNS for A, CNAME, MX
                  records.
                </li>
                <li>
                  <strong>Search Engines:</strong> Use Google dorks to find
                  indexed subdomains.
                </li>
                <li>
                  <strong>Public DBs:</strong> Check services like Shodan, ASN
                  databases.
                </li>
              </ul>

              <div className="mt-6 p-3 bg-purple-900 rounded border border-purple-600">
                <p className="text-xs text-purple-200">
                  <strong>Lab Difficulty:</strong> Medium (25 points)
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubdomainEnumerationLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SubdomainEnumerationLabContent />
    </Suspense>
  );
}
