"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, Challenge, Lab } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const challengeLabSlugs: Record<string, string> = {
  "SQL Injection 101": "sql-injection-101",
  "XSS Vulnerability": "xss-vulnerability",
  "CSRF Attack": "csrf-attack",
  "Caesar Cipher": "caesar-cipher",
  "RSA Encryption": "rsa-encryption",
  "Hash Collision": "xor-repeating-key",
  "Simple Binary": "simple-binary",
  "Memory Dump Analysis": "memory-dump-analysis",
  "Packet Analysis": "packet-analysis",
  "Log File Investigation": "log-file-investigation",
  "Disk Image Recovery": "disk-image-recovery",
  "Whois Lookup": "whois-lookup",
  "Subdomain Enumeration": "subdomain-enumeration",
  "GitHub Recon": "github-recon",
  "Corporate Footprint Reconstruction": "subdomain-enumeration",
  "Landmark + Timeline Correlation": "github-recon",
  "IP Geolocation": "ip-geolocation",
  "Aviation + Open Registries": "ip-geolocation",
  "Email Harvesting": "email-harvesting",
  "Social Media Profiling": "social-media-profiling",
  "DNS History Investigation": "dns-history-investigation",
  "Organizational Change Tracking": "dns-history-investigation",
  "Password Cracking": "password-cracking",
  Steganography: "steganography",
  "Social Engineering": "social-engineering",
  "XOR Repeating Key": "xor-repeating-key",
};

const challengeContentOverrides: Record<
  string,
  { title?: string; description?: string; fullDescription?: string }
> = {
  "Hash Collision": {
    title: "XOR Repeating Key",
    description: "Break a repeating-key XOR cipher",
    fullDescription:
      "A ciphertext was encrypted with a repeating-key XOR scheme. Determine the key and recover the plaintext flag.",
  },
  "GitHub Recon": {
    title: "Landmark + Timeline Correlation",
    description:
      "Use public historical records to correlate opening dates and key figures for a landmark.",
    fullDescription:
      "The iron landmark in Paris was opened in 1889. Using only open sources, identify the exact weekday the Eiffel Tower officially opened to the public, and name the chief engineer responsible for its construction.",
  },
  "Subdomain Enumeration": {
    title: "Corporate Footprint Reconstruction",
    description:
      "Trace corporate filings and news coverage to verify SpaceX's registered office in 2010.",
    fullDescription:
      "A private aerospace company launched its first Falcon 9 rocket in 2010. Using open data only, determine the original registered office address of SpaceX at the time of that launch.",
  },
  "IP Geolocation": {
    title: "Aviation + Open Registries",
    description:
      "Trace a Boeing 777's emergency diversion using flight trackers and public aircraft registries.",
    fullDescription:
      "A Boeing 777 made headlines after an emergency diversion in 2023. Using flight trackers and aircraft registries, identify the tail number of the Boeing 777 operated by United Airlines involved in that incident, plus its manufacture year.",
  },
  "DNS History Investigation": {
    title: "Organizational Change Tracking",
    description:
      "Use open-source timelines to verify when the WHO renewed its Director-General's mandate during COVID-19.",
    fullDescription:
      "A global health body updated its leadership during the COVID era. Using press releases and archived webpages, determine the month and year when the World Health Organization formally renewed its current Director-General's term.",
  },
  "Organizational Change Tracking": {
    description:
      "Use open-source timelines to verify when the WHO renewed its Director-General's mandate during COVID-19.",
    fullDescription:
      "A global health body updated its leadership during the COVID era. Using press releases and archived webpages, determine the month and year when the World Health Organization formally renewed its current Director-General's term.",
  },
};

// DNS Enumeration Guide Component
function DnsEnumerationGuide() {
  return (
    <Card className="bg-slate-800 border-slate-700 mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🔍 Manual URL Enumeration</h2>
        
        <div className="bg-slate-900 border border-slate-700 rounded p-4 mb-4 space-y-3">
          <p className="text-slate-300">
            This challenge requires <span className="font-semibold text-blue-300">manual URL discovery</span>. There are no clickable buttons or direct clues—you must explore the namespace yourself.
          </p>
          
          <p className="text-slate-300">
            <span className="font-semibold text-blue-300">Challenge IDs are irrelevant</span> for this puzzle. Instead, manually try different paths under the <span className="font-mono text-slate-400">/network/</span> namespace.
          </p>
          
          <div className="bg-slate-950 border border-slate-700 rounded p-3">
            <p className="text-slate-400 text-xs mb-2 font-semibold">Starting Point:</p>
            <p className="font-mono text-slate-300 text-sm">/network/admin-panel</p>
          </div>

          <p className="text-slate-400 text-xs">
            Modify the URL in your browser address bar to explore. Each endpoint may contain hints about naming conventions used in the infrastructure.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
          <p className="text-sm text-blue-300">
            <span className="font-semibold">💡 Strategy:</span> Look for hints about common DevOps naming patterns. Infrastructure often uses versioning, staging conventions, and namespace hierarchies.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Man-in-the-Middle Guide Component with Terminal-style Log Viewer
function MitmGuide() {
  return (
    <>
      {/* Story Section */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            📖 Incident Narrative
          </h2>
          <div className="space-y-3">
            <p className="text-slate-300">
              A user connected to what appeared to be a legitimate public WiFi
              network while accessing a secure banking service. Unbeknownst to
              them, a malicious proxy server was intercepting all traffic.
            </p>
            <p className="text-slate-300">
              The attacker logged all HTTP requests and responses, capturing
              sensitive information transmitted between the client and the web
              service. Some data was transmitted without proper encryption or
              obfuscation, and tokens were passed in plaintext headers.
            </p>
            <p className="text-slate-300">
              Your task: Analyze the intercepted proxy logs below to identify
              any sensitive data that may have leaked due to insecure handling
              of credentials, tokens, or authentication headers.
            </p>
          </div>
        </div>
      </Card>

      {/* Log Viewer Card */}
      <Card className="bg-slate-900 border-slate-700 mb-6 overflow-hidden">
        <div className="p-0">
          {/* Terminal Header */}
          <div className="bg-slate-950 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-400 text-xs font-mono ml-2">
              proxy_interceptor.log
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 bg-slate-950 font-mono text-xs overflow-y-auto max-h-96">
            <div className="space-y-4 text-slate-300">
              {/* Log Entry 1 */}
              <div>
                <p className="text-cyan-400">
                  [12:01:04] CONNECT api.securebank.com
                </p>
              </div>

              {/* Log Entry 2 */}
              <div className="border-t border-slate-800 pt-4">
                <p className="text-cyan-400">
                  [12:01:07] REQUEST POST /api/login
                </p>
                <p className="text-slate-400 mt-1">Headers:</p>
                <p className="text-slate-500 ml-2">
                  Content-Type: application/json
                </p>
                <p className="text-slate-500 ml-2">
                  User-Agent: MobileClient/3.4
                </p>
                <p className="text-slate-400 mt-2">Body:</p>
                <div className="ml-2 text-slate-500">
                  <p>{`{`}</p>
                  <p className="ml-2">{`"username": "guest_user",`}</p>
                  <p className="ml-2">{`"password": "welcome123"`}</p>
                  <p>{`}`}</p>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 3 */}
              <div>
                <p className="text-green-400">[12:01:09] RESPONSE 200 OK</p>
                <p className="text-slate-400 mt-1">
                  Set-Cookie: session_id=8f23ac91abffe22
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 4 - KEY: Base64 encoded flag */}
              <div>
                <p className="text-cyan-400">
                  [12:01:15] REQUEST GET /api/profile
                </p>
                <p className="text-slate-400 mt-1">Headers:</p>
                <p className="text-slate-500 ml-2">
                  Authorization: Bearer ZmxhZ3ttaXRtX3N1Y2Nlc3N9
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 5 */}
              <div>
                <p className="text-green-400">[12:01:18] RESPONSE 200 OK</p>
                <div className="mt-1 ml-2 text-slate-500">
                  <p>{`{`}</p>
                  <p className="ml-2">{`"name": "Guest User",`}</p>
                  <p className="ml-2">{`"balance": "₹12,450"`}</p>
                  <p>{`}`}</p>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 6 */}
              <div>
                <p className="text-cyan-400">
                  [12:01:25] REQUEST GET /api/notifications
                </p>
                <p className="text-slate-400 mt-1">Headers:</p>
                <p className="text-slate-500 ml-2">
                  Authorization: Bearer 3a4f9d220991ab
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 7 */}
              <div>
                <p className="text-red-400">
                  [12:01:29] RESPONSE 403 Forbidden
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-600">
                  --------------------------------------------------
                </p>
              </div>

              {/* Log Entry 8 */}
              <div>
                <p className="text-cyan-400">
                  [12:01:34] REQUEST GET /api/debug
                </p>
                <p className="text-slate-400 mt-1">Headers:</p>
                <p className="text-slate-500 ml-2">X-Debug-Mode: disabled</p>
              </div>
            </div>
          </div>

          {/* Instruction Section */}
          <div className="bg-slate-900 border-t border-slate-700 p-6">
            <h3 className="text-slate-300 font-semibold mb-3 text-sm">
              🔎 Analysis Task
            </h3>
            <p className="text-slate-400 text-sm mb-3">
              Review the intercepted proxy logs above. Identify any suspicious
              or encoded tokens in the request headers.
            </p>
            <p className="text-slate-400 text-sm mb-3">
              Look for patterns that suggest the data is encoded. Common
              encodings include Base64, hex, or URL encoding.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lab, setLab] = useState<Lab | null>(null);

  useEffect(() => {
    fetchChallenge();
    fetchUser();
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (error) throw error;

      setChallenge(data);
      checkIfSolved(data.id);
      fetchLabForChallenge(data.id);
    } catch (error) {
      console.error("Error fetching challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabForChallenge = async (cId: string) => {
    try {
      const { data, error } = await supabase
        .from("labs")
        .select("*")
        .eq("challenge_id", cId)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching lab for challenge:", error);
        return;
      }

      setLab(data as Lab);
    } catch (error) {
      console.error("Error fetching lab for challenge:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const checkIfSolved = async (cId: string) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data, error } = await supabase
        .from("solves")
        .select("id")
        .eq("challenge_id", cId)
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" which is expected when not solved
        console.error("Error checking solve status:", error);
        return;
      }

      setIsSolved(!!data);
    } catch (error) {
      console.log("Not yet solved");
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !challenge || !flag.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      // Check if flag is correct (simple comparison for demo)
      const isCorrect =
        flag.trim().toLowerCase() === challenge.flag_hash.toLowerCase();

      // Record submission
      const { error: submitError } = await supabase.from("submissions").insert({
        user_id: userId,
        challenge_id: challenge.id,
        flag_submitted: flag,
        is_correct: isCorrect,
      });

      if (submitError) throw submitError;

      if (isCorrect) {
        // Record solve
        const { error: solveError } = await supabase.from("solves").insert({
          user_id: userId,
          challenge_id: challenge.id,
          solve_time: new Date().toISOString(),
        });

        if (solveError) throw solveError;

        setMessage({
          type: "success",
          text: `🎉 Correct! You earned ${challenge.points} points!`,
        });
        setIsSolved(true);
        setFlag("");

        // Update user score
        await supabase.rpc("update_user_score", {
          p_user_id: userId,
          p_points: challenge.points,
        });
      } else {
        setMessage({ type: "error", text: "Incorrect flag. Try again!" });
        setFlag("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit flag",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400 mb-4">Challenge not found</p>
          <Link href="/challenges">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const labSlug = lab?.slug ?? challengeLabSlugs[challenge.title] ?? null;
  const overrides = challengeContentOverrides[challenge.title];
  const displayTitle = overrides?.title ?? challenge.title;
  const displayDescription =
    overrides?.fullDescription ??
    overrides?.description ??
    challenge.full_description ??
    challenge.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/challenges"
          className="text-blue-400 hover:text-blue-300 mb-6 block"
        >
          ← Back to Challenges
        </Link>
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {displayTitle}
                </h1>
                <p className="text-slate-400 mb-4">{challenge.category}</p>
              </div>
              {isSolved && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  ✓ Solved
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Badge
                className={`border ${getDifficultyColor(challenge.difficulty)}`}
                variant="outline"
              >
                {challenge.difficulty}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {challenge.points} points
              </Badge>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Description
              </h2>
              <p className="text-slate-300 whitespace-pre-wrap">
                {displayDescription}
              </p>
            </div>

            {/* DNS Enumeration Guide */}
            {challenge.title === "DNS Enumeration" && <DnsEnumerationGuide />}

            {/* Man-in-the-Middle Guide (by challenge id) */}
            {challenge.id === "b9d63062-26c4-4db4-b2c7-1e6615f40c6d" && (
              <MitmGuide />
            )}

            {labSlug && (
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm text-slate-400">
                  This challenge has an interactive lab environment where you
                  can exploit the vulnerability directly.
                </p>
                <Link href={`/labs/${labSlug}?challengeId=${challengeId}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {challenge.title === 'Anti-Debug Technique' ? 'Open Lab' : 'Go to Lab'}
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 italic">
                  Labs are intentionally vulnerable and fully isolated. Use them
                  only for learning.
                </p>
              </div>
            )}

            {challenge.resources &&
              Object.keys(challenge.resources).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Resources
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(challenge.resources).map(([key, value]) => (
                      <a
                        key={key}
                        href={value as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline block"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </Card>

        {!isSolved && (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Submit Flag
              </h2>

              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Flag
                  </label>
                  <Input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="Enter the flag here"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isSolved}
                  />
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-md border ${
                      message.type === "success"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <p
                      className={
                        message.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || isSolved}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {submitting ? "Submitting..." : "Submit Flag"}
                </Button>
              </form>
            </div>
          </Card>
        )}

        {isSolved && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8 text-center">
              <p className="text-green-400 text-lg font-semibold">
                ✓ You have already solved this challenge!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
