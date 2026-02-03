'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function DNSHistoryLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [domain, setDomain] = useState('');
  const [history, setHistory] = useState<
    { date: string; ip: string; provider: string; notes: string }[]
  >([]);
  const [flagFound, setFlagFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated DNS history database
  const dnsHistoryDB: {
    [key: string]: { date: string; ip: string; provider: string; notes: string }[];
  } = {
    'example.com': [
      {
        date: '2024-12-15',
        ip: '93.184.216.34',
        provider: 'ARIN (Akamai)',
        notes: 'Current DNS records',
      },
      {
        date: '2024-06-10',
        ip: '192.0.2.1',
        provider: 'RIPE (Old provider)',
        notes: 'Previous DNS configuration',
      },
      {
        date: '2023-01-01',
        ip: '198.51.100.1',
        provider: 'APNIC',
        notes: 'Very old historical record',
      },
    ],
    'ctf-event.com': [
      {
        date: '2024-12-20',
        ip: '203.0.113.5',
        provider: 'LACNIC',
        notes: 'Current configuration',
      },
      {
        date: '2024-08-15',
        ip: 'flag{dns_history_uncovered}',
        provider: 'Hidden Server',
        notes: 'Leaked internal server address found in DNS logs',
      },
      {
        date: '2024-03-01',
        ip: '192.0.2.100',
        provider: 'Old Hosting',
        notes: 'Previous hosting provider',
      },
    ],
    'vulnerable.io': [
      {
        date: '2024-12-10',
        ip: '198.51.100.50',
        provider: 'Current Provider',
        notes: 'Active DNS resolution',
      },
      {
        date: '2024-09-05',
        ip: 'flag{dns_history_uncovered}',
        provider: 'Test Server',
        notes: 'Testing environment discovered in DNS cache',
      },
      {
        date: '2024-01-15',
        ip: '203.0.113.20',
        provider: 'Previous Provider',
        notes: 'Old DNS configuration',
      },
    ],
  };

  const handleInvestigate = async () => {
    const domainLower = domain.toLowerCase().trim();

    if (!domainLower) {
      setHistory([]);
      return;
    }

    setIsSearching(true);

    // Simulate searching delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (dnsHistoryDB[domainLower]) {
      const records = dnsHistoryDB[domainLower];
      setHistory(records);

      // Check if flag is in history
      const flagInHistory = records.some((r) =>
        r.ip.includes('flag{dns_history_uncovered}')
      );
      if (flagInHistory) {
        setFlagFound(true);
      }
    } else {
      setHistory([]);
      alert(
        `No DNS history found for "${domainLower}". Try: example.com, ctf-event.com, vulnerable.io`
      );
    }

    setIsSearching(false);
  };

  const handleReset = () => {
    setDomain('');
    setHistory([]);
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
          <h1 className="text-4xl font-bold mb-2">DNS History Investigation</h1>
          <p className="text-slate-300">
            Uncover historical DNS records to find hidden infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                DNS History Lookup
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Domain Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isSearching) handleInvestigate();
                    }}
                    disabled={isSearching}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleInvestigate}
                    disabled={isSearching}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSearching ? 'Investigating...' : 'Investigate History'}
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

              {history.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-blue-300 mb-3">
                    DNS Record History ({history.length} records)
                  </h3>
                  <div className="space-y-2">
                    {history.map((record, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-700 rounded border border-slate-600 hover:border-purple-500 transition"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-400">Date</p>
                            <p className="text-sm font-mono text-green-400">
                              {record.date}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Provider</p>
                            <p className="text-sm text-slate-200">
                              {record.provider}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-slate-400">IP Address</p>
                          <p className="text-sm font-mono text-cyan-400">
                            {record.ip}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-slate-400">Notes</p>
                          <p className="text-sm text-slate-300">
                            {record.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {flagFound && (
                <div className="mt-6 p-4 bg-green-900 border border-green-600 rounded">
                  <p className="text-green-100 font-semibold">
                    ✓ Flag Found! Look through the DNS history records to find
                    it.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                DNS Resources
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <strong>Passive DNS:</strong> Records DNS queries over time
                </li>
                <li>
                  <strong>DNS Caches:</strong> Search engines and CDNs store
                  records
                </li>
                <li>
                  <strong>Zone Files:</strong> Historical AXFR transfers
                </li>
                <li>
                  <strong>WHOIS:</strong> Registrant changes indicate moves
                </li>
                <li>
                  <strong>Certificate Logs:</strong> SSL certs reveal domains
                </li>
              </ul>

              <div className="mt-6 p-3 bg-blue-900 rounded border border-blue-600">
                <p className="text-xs text-blue-200 mb-2">
                  <strong>Tools:</strong>
                </p>
                <p className="text-xs text-blue-100">
                  RiskIQ Passive DNS, SecurityTrails, AlienVault OTX, Shodan
                </p>
              </div>

              <div className="mt-4 p-3 bg-purple-900 rounded border border-purple-600">
                <p className="text-xs text-purple-200">
                  <strong>Lab Difficulty:</strong> Hard (50 points)
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DNSHistoryLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <DNSHistoryLabContent />
    </Suspense>
  );
}
