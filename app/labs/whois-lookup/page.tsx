'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

function WhoisLookupLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');
  const [flagFound, setFlagFound] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Simulated WHOIS database with hidden flags
  const whoisDatabase: { [key: string]: string } = {
    'example.com': `
Domain Name: EXAMPLE.COM
Registry Domain ID: D402200000-AGRS
Registrar WHOIS Server: whois.iana.org
Registrar URL: http://www.iana.org
Updated Date: 2024-01-15T10:20:30Z
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2025-08-13T04:00:00Z
Registrar: Internet Assigned Numbers Authority
Registrar IANA ID: 376
Admin Name: IANA Admin
Admin Email: admin@iana.org
Tech Name: IANA Tech Support
Tech Email: tech@iana.org
Name Server: A.IANA-SERVERS.NET
Flag Hidden: flag{whois_info_found}
    `,
    'ctf-event.com': `
Domain Name: CTF-EVENT.COM
Registry Domain ID: C789456000-AGRS
Registrar: Security Events Inc
Admin Name: John Security
Admin Email: john@ctf-event.com
Tech Name: Tech Support
Tech Email: support@ctf-event.com
Name Server: NS1.CTFHOST.NET
Name Server: NS2.CTFHOST.NET
Creation Date: 2024-01-01T00:00:00Z
Registry Expiry Date: 2025-01-01T00:00:00Z
Hidden Flag: flag{whois_info_found}
    `,
    'vulnerable.io': `
Domain Name: VULNERABLE.IO
Registrant Name: Security Tester
Registrant Email: admin@vulnerable.io
Registrant Organization: Testing Lab
Admin Name: Lab Admin
Admin Phone: +1.2125551234
Admin Email: admin@vulnerable.io
Admin Fax: +1.2125555678
Tech Name: Technical Contact
Tech Phone: +1.2125559876
Tech Email: tech@vulnerable.io
Name Server: DNS1.VULNERABLE.IO
Name Server: DNS2.VULNERABLE.IO
Creation Date: 2023-06-15T12:30:45Z
Updated Date: 2024-02-10T08:15:22Z
Registry Expiry Date: 2025-06-15T12:30:45Z
Secret Flag: flag{whois_info_found}
    `,
  };

  const handleLookup = () => {
    setAttempts(attempts + 1);
    const domainLower = domain.toLowerCase().trim();

    if (!domainLower) {
      setResult('Please enter a domain name to look up.');
      return;
    }

    if (whoisDatabase[domainLower]) {
      const whoisInfo = whoisDatabase[domainLower];
      setResult(whoisInfo);

      // Check if the flag is revealed
      if (
        whoisInfo.includes('flag{whois_info_found}') ||
        whoisInfo.includes('Hidden Flag') ||
        whoisInfo.includes('Secret Flag')
      ) {
        setFlagFound(true);
      }
    } else {
      setResult(
        `No WHOIS information found for "${domainLower}". Try domains like: example.com, ctf-event.com, or vulnerable.io`
      );
    }
  };

  const handleReset = () => {
    setDomain('');
    setResult('');
    setFlagFound(false);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href={backHref}>
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              ← {backText}
            </Button>
          </Link>
          
        </div>

        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                🔍 OSINT / Recon
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Easy
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                10 pts
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white">WHOIS Decoder</h1>
            <p className="text-slate-400">
               Learn how to gather public information about domains using WHOIS
            </p>
            <div className="bg-slate-900/50 border border-slate-700 rounded p-4">
              <h2 className="text-lg font-semibold text-blue-300 mb-2">WHOIS Lookup</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Domain Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleLookup();
                    }}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleLookup}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    🔓 Decrypt & Lookup
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 bg-transparent text-slate-200"
                  >
                    Reset
                  </Button>
                </div>

                {attempts > 0 && (
                  <div className="text-sm text-slate-400">
                    Decryption Attempts: {attempts}
                  </div>
                )}
              </div>

              {result && (
                <div className="mt-6 p-4 bg-slate-900/70 rounded border border-slate-700">
                  <p className="text-xs text-blue-300 mb-2 font-mono">--- DECRYPTED WHOIS DATA ---</p>
                  <pre className="text-sm text-slate-200 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                    {result}
                  </pre>
                  <p className="text-xs text-blue-300 mt-2 font-mono">--- END DATA ---</p>
                </div>
              )}

              {flagFound && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
                  <p className="text-green-300 font-semibold">
                    ✓ Cipher Cracked! Extract the flag from the decrypted WHOIS above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">📜 Caesar Cipher Hints</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <strong className="text-blue-300">What is WHOIS?</strong> Public registry data for domains.
              </li>
              <li>
                <strong className="text-blue-300">Public Information:</strong> Registration details unless privacy is enabled.
              </li>
              <li>
                <strong className="text-blue-300">Key Data:</strong> Admin contacts, name servers, and dates.
              </li>
              <li>
                <strong className="text-blue-300">Cipher Angle:</strong> Think of WHOIS fields as encoded clues.
              </li>
            </ul>


            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <p className="text-xs text-blue-200">
                <strong>Lab Difficulty:</strong> Easy (10 points)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function WhoisLookupLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <WhoisLookupLabContent />
    </Suspense>
  );
}
