'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SocialMediaProfilingLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<{
    name: string;
    bio: string;
    posts: string[];
    email?: string;
    phone?: string;
    location?: string;
  } | null>(null);
  const [flagFound, setFlagFound] = useState(false);

  // Simulated social media profiles
  const profiles: {
    [key: string]: {
      name: string;
      bio: string;
      posts: string[];
      email?: string;
      phone?: string;
      location?: string;
    };
  } = {
    john_dev: {
      name: 'John Developer',
      bio: 'Software developer from San Francisco',
      posts: [
        'Just deployed new API endpoints! #coding',
        'Check out my GitHub: github.com/johndev',
        'Working on a secret project, stay tuned!',
      ],
      email: 'john@company.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
    },
    sarah_sec: {
      name: 'Sarah Security',
      bio: 'Security researcher and CTF enthusiast',
      posts: [
        'Found a critical vulnerability in XYZ service',
        'Attending DEFCON this year!',
        'My email: flag{profile_info_gathered}@security.io',
      ],
      email: 'sarah@security.io',
      location: 'New York, NY',
    },
    admin_user: {
      name: 'Admin Account',
      bio: 'Company administrator',
      posts: [
        'Company event photos from yesterday',
        'Team building exercise was great!',
        'FYI: Flag for OSINT lab is flag{profile_info_gathered}',
      ],
      email: 'admin@company.com',
      phone: '+1-555-9999',
      location: 'Corporate HQ',
    },
    hacker_pro: {
      name: 'Professional Hacker',
      bio: 'Security professional',
      posts: [
        'Just discovered: flag{profile_info_gathered}',
        'OSINT techniques are powerful',
        'Always verify information from multiple sources',
      ],
      email: 'contact@hacker.pro',
    },
  };

  const handleSearch = () => {
    const usernameLower = username.toLowerCase().trim();

    if (!usernameLower) {
      setProfile(null);
      return;
    }

    if (profiles[usernameLower]) {
      const foundProfile = profiles[usernameLower];
      setProfile(foundProfile);

      // Check if flag is found in any field
      const profileStr = JSON.stringify(foundProfile).toLowerCase();
      if (profileStr.includes('flag{profile_info_gathered}')) {
        setFlagFound(true);
      }
    } else {
      setProfile({
        name: 'User Not Found',
        bio: `No profile found for "${usernameLower}". Try: john_dev, sarah_sec, admin_user, hacker_pro`,
        posts: [],
      });
    }
  };

  const handleReset = () => {
    setUsername('');
    setProfile(null);
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
          <h1 className="text-4xl font-bold mb-2">Social Media Profiling Lab</h1>
          <p className="text-slate-300">
            Gather sensitive information from social media profiles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                Profile Search
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., john_dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSearch}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Search Profile
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

              {profile && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-slate-700 rounded border border-slate-600">
                    <h3 className="text-lg font-semibold text-blue-300">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1">{profile.bio}</p>
                  </div>

                  {profile.email && (
                    <div className="p-3 bg-slate-700 rounded border border-slate-600">
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm text-green-400 font-mono">
                        {profile.email}
                      </p>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="p-3 bg-slate-700 rounded border border-slate-600">
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm text-green-400 font-mono">
                        {profile.phone}
                      </p>
                    </div>
                  )}

                  {profile.location && (
                    <div className="p-3 bg-slate-700 rounded border border-slate-600">
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm text-green-400">{profile.location}</p>
                    </div>
                  )}

                  {profile.posts.length > 0 && (
                    <div className="p-4 bg-slate-700 rounded border border-slate-600">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Recent Posts
                      </h4>
                      <ul className="space-y-2">
                        {profile.posts.map((post, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-200 p-2 bg-slate-800 rounded"
                          >
                            {post}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {flagFound && (
                <div className="mt-6 p-4 bg-green-900 border border-green-600 rounded">
                  <p className="text-green-100 font-semibold">
                    ✓ Flag Found! Extract it from the profile information above.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                OSINT Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <strong>Profile Analysis:</strong> Check bio, posts, and
                  comments for clues.
                </li>
                <li>
                  <strong>Metadata:</strong> Look for geotags, timestamps, and
                  device info.
                </li>
                <li>
                  <strong>Cross-reference:</strong> Connect profiles across
                  platforms.
                </li>
                <li>
                  <strong>Document Everything:</strong> Take screenshots and
                  archive pages.
                </li>
                <li>
                  <strong>Legal Bounds:</strong> Always follow laws and
                  platform terms.
                </li>
              </ul>

              <div className="mt-6 p-3 bg-orange-900 rounded border border-orange-600">
                <p className="text-xs text-orange-200 mb-2">
                  <strong>Warning:</strong>
                </p>
                <p className="text-xs text-orange-100">
                  Real OSINT should always be conducted ethically and legally
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

export default function SocialMediaProfilingLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SocialMediaProfilingLabContent />
    </Suspense>
  );
}
