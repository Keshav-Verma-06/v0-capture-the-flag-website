'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface GeoLocation {
  country: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  isp: string;
}

function IPGeolocationLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flagFound, setFlagFound] = useState(false);
  const [geoData, setGeoData] = useState<GeoLocation | null>(null);
  const [message, setMessage] = useState('');

  // Sample IP database
  const ipDatabase: Record<string, GeoLocation> = {
    '203.0.113.42': {
      country: 'United States',
      city: 'San Francisco',
      region: 'California',
      latitude: 37.7749,
      longitude: -122.4194,
      isp: 'TechCorp ISP',
    },
    '198.51.100.89': {
      country: 'United Kingdom',
      city: 'London',
      region: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      isp: 'Global Networks Ltd',
    },
    '192.0.2.156': {
      country: 'Germany',
      city: 'Berlin',
      region: 'Berlin',
      latitude: 52.52,
      longitude: 13.405,
      isp: 'EuroConnect Services',
    },
  };

  const targetIP = '203.0.113.42';
  const flag = 'flag{ip_geolocation_found}';

  const handleLookup = async () => {
    if (!ipInput.trim()) {
      setMessage('Please enter an IP address');
      return;
    }

    setLoading(true);
    setMessage('');
    setGeoData(null);

    // Simulate geolocation lookup
    setTimeout(() => {
      const lookup = ipDatabase[ipInput.trim()];

      if (lookup) {
        setGeoData(lookup);
        setMessage('IP address located successfully!');

        if (ipInput.trim() === targetIP) {
          setFlagFound(true);
        }
      } else {
        setMessage('IP address not found in database. Try one of the available IPs.');
        setGeoData(null);
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
              <CardTitle className="text-3xl text-white">IP Geolocation Lab</CardTitle>
              <CardDescription className="text-slate-400">
                Determine the physical location of IP addresses using OSINT databases
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
                IP geolocation is the process of identifying the geographic location of an IP address. This information can be gathered from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>MaxMind GeoIP databases</li>
                <li>IP2Location services</li>
                <li>ASN (Autonomous System Number) lookups</li>
                <li>WHOIS data correlations</li>
                <li>ISP routing information</li>
              </ul>
              <p className="pt-4 text-yellow-400">
                Available test IPs:
              </p>
              <div className="space-y-1 text-sm font-mono ml-4">
                <div>203.0.113.42 (Primary Target)</div>
                <div>198.51.100.89</div>
                <div>192.0.2.156</div>
              </div>
            </CardContent>
          </Card>

          {/* Geolocation Tool */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Geolocation Lookup Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300">Enter IP Address:</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., 203.0.113.42"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                    className="flex-1 bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                  />
                  <Button
                    onClick={handleLookup}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Locating...' : 'Lookup IP'}
                  </Button>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-3 rounded text-sm ${
                    geoData
                      ? 'bg-green-900 text-green-300 border border-green-700'
                      : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Geolocation Results */}
              {geoData && (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                      <p className="text-slate-400 text-xs uppercase font-semibold">Country</p>
                      <p className="text-white text-lg">{geoData.country}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                      <p className="text-slate-400 text-xs uppercase font-semibold">City</p>
                      <p className="text-white text-lg">{geoData.city}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                      <p className="text-slate-400 text-xs uppercase font-semibold">Region</p>
                      <p className="text-white text-lg">{geoData.region}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                      <p className="text-slate-400 text-xs uppercase font-semibold">ISP</p>
                      <p className="text-white text-lg">{geoData.isp}</p>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <p className="text-slate-400 text-xs uppercase font-semibold mb-2">Coordinates</p>
                    <div className="font-mono text-slate-300">
                      <p>Latitude: {geoData.latitude.toFixed(4)}°</p>
                      <p>Longitude: {geoData.longitude.toFixed(4)}°</p>
                    </div>
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
                <strong className="text-slate-200">MaxMind GeoIP2:</strong> Industry-standard geolocation database
              </p>
              <p>
                <strong className="text-slate-200">IP2Location:</strong> Comprehensive IP intelligence platform
              </p>
              <p>
                <strong className="text-slate-200">ipstack:</strong> Real-time IP geolocation and threat intelligence
              </p>
              <p>
                <strong className="text-slate-200">Shodan:</strong> Search engine for Internet-connected devices with IP info
              </p>
              <p>
                <strong className="text-slate-200">curl ifconfig.me:</strong> Simple command to get your public IP
              </p>
              <p className="pt-2 border-t border-slate-700 text-yellow-300">
                ⚠️ Geolocation data is approximate and based on ISP registration. Accuracy varies by region.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function IPGeolocationLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <IPGeolocationLabContent />
    </Suspense>
  );
}
