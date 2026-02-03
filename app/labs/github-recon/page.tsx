'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function GitHubReconLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<
    { repo: string; secret: string; severity: string }[]
  >([]);
  const [flagFound, setFlagFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated GitHub leak database
  const leakDatabase = [
    {
      repo: 'company/web-app',
      secret: 'API_KEY=sk_live_51234567890abcdefg',
      severity: 'Critical',
    },
    {
      repo: 'developer/ctf-scripts',
      secret: 'AWS_SECRET=AKIAIOSFODNN7EXAMPLE',
      severity: 'Critical',
    },
    {
      repo: 'team/internal-tools',
      secret: 'DATABASE_URL=postgres://user:flag{github_secret_exposed}@db.local',
      severity: 'Critical',
    },
    {
      repo: 'project/deployment',
      secret: 'JWT_SECRET=super_secret_key_12345',
      severity: 'High',
    },
    {
      repo: 'backup/config-files',
      secret: 'PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...',
      severity: 'Critical',
    },
    {
      repo: 'utils/setup-scripts',
      secret: 'PASSWORD=flag{github_secret_exposed}',
      severity: 'High',
    },
  ];

  const handleSearch = async () => {
    setIsSearching(true);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (!search.toLowerCase().trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Filter results based on search term
    const filtered = leakDatabase.filter(
      (item) =>
        item.repo.toLowerCase().includes(search.toLowerCase()) ||
        item.secret.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
      setResults(
        leakDatabase.slice(0, 3) as {
          repo: string;
          secret: string;
          severity: string;
        }[]
      );
    } else {
      setResults(filtered);
    }

    // Check if flag is exposed
    const flagExposed = filtered.some((item) =>
      item.secret.includes('flag{github_secret_exposed}')
    );
    if (flagExposed) {
      setFlagFound(true);
    }

    setIsSearching(false);
  };

  const handleReset = () => {
    setSearch('');
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
          <h1 className="text-4xl font-bold mb-2">GitHub Recon Lab</h1>
          <p className="text-slate-300">
            Search for exposed secrets and leaked credentials on GitHub
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                Secret Search
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Search Keywords
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., API_KEY, database, password, flag"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isSearching) handleSearch();
                    }}
                    disabled={isSearching}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSearching ? 'Searching...' : 'Search GitHub'}
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
                <div className="mt-6 space-y-3">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-700 rounded border border-slate-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-300">
                          {result.repo}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            result.severity === 'Critical'
                              ? 'bg-red-900 text-red-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}
                        >
                          {result.severity}
                        </span>
                      </div>
                      <code className="text-xs bg-slate-900 p-2 rounded block overflow-x-auto text-green-400">
                        {result.secret}
                      </code>
                    </div>
                  ))}
                </div>
              )}

              {flagFound && (
                <div className="mt-6 p-4 bg-green-900 border border-green-600 rounded">
                  <p className="text-green-100 font-semibold">
                    ✓ Flag Found! Extract the flag from the exposed secrets
                    above.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Common Leaks
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• API Keys and Tokens</li>
                <li>• Database Passwords</li>
                <li>• Private Keys</li>
                <li>• AWS Credentials</li>
                <li>• JWT Secrets</li>
                <li>• Email Addresses</li>
                <li>• Internal URLs</li>
              </ul>

              <div className="mt-6 p-3 bg-blue-900 rounded border border-blue-600">
                <p className="text-xs text-blue-200 mb-2">
                  <strong>Real-world examples:</strong>
                </p>
                <p className="text-xs text-blue-100">
                  Use GitHub search with filters like: filename:config, in:file,
                  language:env
                </p>
              </div>

              <div className="mt-4 p-3 bg-purple-900 rounded border border-purple-600">
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

export default function GitHubReconLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <GitHubReconLabContent />
    </Suspense>
  );
}
