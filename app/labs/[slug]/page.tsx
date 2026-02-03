'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase, Challenge, Lab } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type LabStatus = 'idle' | 'running' | 'completed';

type SqlInjResponse = {
  success: boolean;
  message: string;
  flag?: string;
  debugQuery: string;
};

function LabPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [lab, setLab] = useState<Lab | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [labSessionId, setLabSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<LabStatus>('idle');
  const [isSolved, setIsSolved] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [revealedFlag, setRevealedFlag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setGlobalError(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        router.push(`/login?redirect=/labs/${slug}`);
        return;
      }

      const currentUserId = authData.user.id;
      setUserId(currentUserId);

      const { data: labData, error: labError } = await supabase
        .from('labs')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (labError || !labData) {
        setGlobalError('Lab not found or inactive.');
        setLoading(false);
        return;
      }

      const typedLab = labData as Lab;
      setLab(typedLab);

      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', typedLab.challenge_id)
        .single();

      if (challengeError || !challengeData) {
        setGlobalError('Failed to load challenge details for this lab.');
        setLoading(false);
        return;
      }

      setChallenge(challengeData as Challenge);

      const { data: existingSolve } = await supabase
        .from('solves')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('challenge_id', typedLab.challenge_id)
        .maybeSingle();

      if (existingSolve) {
        setIsSolved(true);
        setStatus('completed');
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('lab_sessions')
        .insert({
          user_id: currentUserId,
          lab_id: typedLab.id,
        })
        .select('id')
        .single();

      if (!sessionError && sessionData) {
        setLabSessionId(sessionData.id);
      }

      setStatus('running');
      setLoading(false);
    };

    init();
  }, [slug, router]);

  const markLabCompleted = async (flag: string) => {
    if (!userId || !lab || !challenge) return;

    if (isSolved) {
      setRevealedFlag(flag);
      setStatus('completed');
      return;
    }

    setStatus('completed');
    setRevealedFlag(flag);

    if (labSessionId) {
      await supabase
        .from('lab_sessions')
        .update({
          success: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', labSessionId);
    }

    const { data: existingSolve } = await supabase
      .from('solves')
      .select('id')
      .eq('user_id', userId)
      .eq('challenge_id', lab.challenge_id)
      .maybeSingle();

    if (!existingSolve) {
      await supabase.from('solves').insert({
        user_id: userId,
        challenge_id: lab.challenge_id,
        solve_time: new Date().toISOString(),
      });

      await supabase.rpc('update_user_score', {
        p_user_id: userId,
        p_points: challenge.points,
      });
    }

    setIsSolved(true);
  };

  const renderLabContent = () => {
    if (!lab || !challenge) return null;

    switch (lab.slug) {
      case 'sql-injection-101':
        return (
          <SqlInjectionLab
            onSolved={markLabCompleted}
            currentFlag={revealedFlag}
            status={status}
          />
        );
      case 'xss-vulnerability':
        return (
          <XssLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'csrf-attack':
        return (
          <CsrfLab
            onSolved={markLabCompleted}
            currentFlag={revealedFlag}
            status={status}
            searchParams={searchParams}
          />
        );
      case 'caesar-cipher':
        return (
          <CaesarLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'rsa-encryption':
        return (
          <RsaLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'simple-binary':
        return (
          <SimpleBinaryLab
            onSolved={markLabCompleted}
            currentFlag={revealedFlag}
            status={status}
          />
        );
      case 'memory-analysis':
        return (
          <MemoryLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'packet-analysis':
        return (
          <PacketLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'log-file-investigation':
        return (
          <LogFileInvestigationLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      case 'disk-image-recovery':
        return (
          <DiskImageRecoveryLab onSolved={markLabCompleted} currentFlag={revealedFlag} status={status} />
        );
      default:
        return (
          <p className="text-slate-400">
            This lab is not yet implemented. Please contact the organizers.
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400">Loading lab...</p>
        </div>
      </div>
    );
  }

  if (globalError || !lab || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-red-400">{globalError || 'Unable to load this lab.'}</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push('/challenges')}
          >
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-1">
              Interactive Lab Environment
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{challenge.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{lab.lab_type.toUpperCase()} · Lab</p>
          </div>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
            onClick={() => router.push(`/challenges/${challenge.id}`)}
          >
            ← Back to Challenge
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-emerald-400 text-sm font-semibold">
                This lab is intentionally vulnerable.
              </p>
              <p className="text-slate-300 text-xs md:text-sm">
                Use it for learning and CTF practice only. No real systems are harmed — all logic is
                simulated within this platform.
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">
                Status:{' '}
                <span
                  className={
                    status === 'completed'
                      ? 'text-emerald-400'
                      : status === 'running'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }
                >
                  {status === 'completed' ? 'Completed' : status === 'running' ? 'Active' : 'Idle'}
                </span>
              </p>
              <p className="text-slate-400 text-xs">Reward: {challenge.points} pts</p>
            </div>
          </div>
        </Card>

        {revealedFlag && (
          <Card className="bg-emerald-950/40 border border-emerald-500/40">
            <div className="p-4 space-y-2">
              <p className="text-emerald-400 text-sm font-semibold">Flag captured!</p>
              <p className="font-mono text-sm md:text-base text-emerald-300 break-all">
                {revealedFlag}
              </p>
              <p className="text-xs text-emerald-300/80">
                This flag has been recorded for scoring via Supabase. You can still revisit the lab
                to review the exploitation steps.
              </p>
            </div>
          </Card>
        )}

        <Card className="bg-slate-900/80 border border-slate-700/80">
          <div className="p-4 md:p-6 space-y-6">
            {renderLabContent()}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SqlInjectionLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [debugQuery, setDebugQuery] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/labs/sql-injection-101', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as SqlInjResponse;
      setDebugQuery(data.debugQuery);
      setMessage(data.message);

      if (data.success && data.flag && status !== 'completed' && !currentFlag) {
        await onSolved(data.flag);
      }
    } catch {
      setMessage('Something went wrong while contacting the vulnerable backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 1: SQL Injection 101</h2>
        <p className="text-slate-400 text-sm">
          This lab simulates an insecure login form where user input is concatenated directly into a
          SQL query.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-mono text-slate-400">
            Backend query (simulated):
            <br />
            <span className="text-slate-300">
              SELECT * FROM users WHERE username='{username || '...'}' AND password='
              {password || '...'}'
            </span>
          </p>

          <div className="space-y-2">
            <label className="text-xs text-slate-300">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Try something like: admin' OR '1'='1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Any value..."
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {submitting ? 'Contacting vulnerable backend...' : 'Login (Insecure)'}
          </Button>

          {message && <p className="text-sm text-slate-200">{message}</p>}
        </div>

        <div className="space-y-3">
          <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3">
            <p className="text-xs text-slate-400 mb-1">Query log</p>
            <pre className="text-[11px] md:text-xs font-mono text-slate-200 whitespace-pre-wrap break-all">
              {debugQuery || 'No queries executed yet.'}
            </pre>
          </div>
          <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Goal</p>
            <p className="text-xs text-slate-300">
              Bypass authentication by injecting into the WHERE clause so that it always evaluates
              to true. On success, the lab reveals the flag and records your solve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function XssLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [xssTriggered, setXssTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalAlert = window.alert;
    window.alert = (...args: any[]) => {
      setXssTriggered(true);
      // eslint-disable-next-line no-console
      console.log('XSS alert captured:', args);
      originalAlert(...args);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    if (xssTriggered && status !== 'completed' && !currentFlag) {
      void onSolved('flag{xss_payload_success}');
    }
  }, [xssTriggered, onSolved, status, currentFlag]);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    setComments((prev) => [...prev, comment]);
    setComment('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 2: XSS Vulnerability</h2>
        <p className="text-slate-400 text-sm">
          This lab simulates a comment system that renders raw HTML using{' '}
          <span className="font-mono text-slate-200">dangerouslySetInnerHTML</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-xs text-slate-300">Post a comment (HTML allowed)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
            placeholder={`Try something like:\n<script>alert('xss')</script>\n\nor\n\n<img src=x onerror="alert('xss')">`}
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Submit Comment
          </Button>

          <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Goal</p>
            <p className="text-xs text-slate-300">
              Craft a payload that executes JavaScript in the victim&apos;s browser. When your
              payload triggers <span className="font-mono">alert()</span>, the lab detects it and
              reveals the flag.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-300">Rendered comments (unsafe):</p>
          <div className="bg-slate-950/70 rounded-md border border-red-500/40 p-3 min-h-[150px] space-y-2">
            {comments.length === 0 && (
              <p className="text-xs text-slate-500">No comments yet. Be the first to inject one.</p>
            )}
            {comments.map((c, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
                dangerouslySetInnerHTML={{ __html: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CsrfLab({
  onSolved,
  currentFlag,
  status,
  searchParams,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
  searchParams: ReturnType<typeof useSearchParams>;
}) {
  const [email, setEmail] = useState('student@example.edu');
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isAttackerMode = searchParams.get('attacker') === '1';

  useEffect(() => {
    const runAttacker = async () => {
      if (!isAttackerMode) return;
      setSubmitting(true);
      try {
        const res = await fetch('/api/labs/csrf-attack/change-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'pwned@example.com',
          }),
        });
        const data = await res.json();
        setServerMessage(data.message);
        if (data.success && data.flag && status !== 'completed' && !currentFlag) {
          await onSolved(data.flag);
        }
      } catch {
        setServerMessage('Attacker request failed (simulation error).');
      } finally {
        setSubmitting(false);
      }
    };

    void runAttacker();
  }, [isAttackerMode, onSolved, status, currentFlag]);

  const handleChangeEmail = async () => {
    setSubmitting(true);
    setServerMessage(null);
    try {
      const res = await fetch('/api/labs/csrf-attack/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setServerMessage(data.message);
    } catch {
      setServerMessage('Request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 3: CSRF Attack</h2>
        <p className="text-slate-400 text-sm">
          This lab simulates a dashboard where a sensitive action (“Change Email”) can be triggered
          by any cross-site POST request. No CSRF tokens, no origin checks.
        </p>
      </div>

      {!isAttackerMode && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs text-slate-300 font-semibold">Victim dashboard</p>
            <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3 space-y-3">
              <div className="space-y-1 text-sm text-slate-200">
                <p>
                  Logged in as: <span className="font-mono text-emerald-300">student@college.edu</span>
                </p>
                <p>
                  Current email:{' '}
                  <span className="font-mono text-sky-300">{email || 'student@example.edu'}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300">Change email (no CSRF protection)</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button
                  onClick={handleChangeEmail}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {submitting ? 'Sending POST request...' : 'Change Email'}
                </Button>
              </div>

              {serverMessage && (
                <p className="text-xs text-slate-200 border-t border-slate-700 pt-2 mt-2">
                  Server: {serverMessage}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-300 font-semibold">Attacker page (simulation)</p>
            <p className="text-xs text-slate-400">
              In the real world, an attacker would host a hidden form on another domain that
              auto-submits to this endpoint. Below is an example HTML payload you could host
              elsewhere.
            </p>
            <Textarea
              readOnly
              className="bg-slate-950/70 border border-red-500/40 text-[11px] font-mono text-slate-100 min-h-[140px]"
              value={`<form action="https://your-ctf-site.example.com/api/labs/csrf-attack/change-email" method="POST">
  <input type="hidden" name="email" value="pwned@example.com" />
</form>
<script>document.forms[0].submit();</script>`}
            />
            <Button
              variant="outline"
              className="border-red-500/60 text-red-300 hover:bg-red-900/30 text-xs"
              onClick={() => {
                window.open('/labs/csrf-attack?attacker=1', '_blank');
              }}
            >
              Open simulated attacker page
            </Button>
            <p className="text-xs text-slate-400">
              When the attacker page loads while you are logged in, it silently sends the POST
              request, changing your email and revealing the flag.
            </p>
          </div>
        </div>
      )}

      {isAttackerMode && (
        <div className="space-y-2">
          <p className="text-xs text-red-300 font-semibold uppercase tracking-[0.2em]">
            Simulated attacker page
          </p>
          <p className="text-xs text-slate-300">
            This page auto-submits a hidden form to change the victim&apos;s email without their
            interaction, demonstrating CSRF.
          </p>
          {serverMessage && (
            <p className="text-xs text-emerald-300 mt-2">
              Server response: {serverMessage} (flag revealed in victim view)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CaesarLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const cipherText = 'iodj{fdhdu_vkliw3}';
  const expected = 'flag{caesar_shift3}';
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === expected) {
      setFeedback('Correct! You reversed the Caesar cipher.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{caesar_shift3}');
      }
    } else {
      setFeedback('That is not the correct plaintext. Double-check your shift.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 4: Caesar Cipher</h2>
        <p className="text-slate-400 text-sm">
          Decrypt the following text, which has been encrypted using a Caesar cipher with a fixed
          shift.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3">
          <p className="text-xs text-slate-400 mb-1">Encrypted text</p>
          <p className="font-mono text-emerald-300 break-all">{cipherText}</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Your decrypted plaintext</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Decryption
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}
      </div>
    </div>
  );
}

function RsaLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{rsa_broken}') {
      setFeedback('Correct RSA plaintext supplied.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{rsa_broken}');
      }
    } else {
      setFeedback('Incorrect plaintext. Re-check your RSA decryption steps.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 5: RSA Encryption</h2>
        <p className="text-slate-400 text-sm">
          You are given an RSA public key and a ciphertext. Your task is to recover the plaintext
          flag.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-slate-950/70 rounded-md border border-slate-700 p-3 space-y-2 text-xs font-mono text-slate-100">
            <p className="text-slate-400 font-semibold">Public key (demo values)</p>
            <p>n = 9516311845790656153499716760847001433441357</p>
            <p>e = 65537</p>
            <p className="text-slate-400 font-semibold mt-2">Ciphertext (hex)</p>
            <p>0x4a93b7c1e0f2d9a7b8c3f1de02ab77c5</p>
          </div>
          <p className="text-xs text-slate-400">
            These parameters are intentionally simplified for a college-level lab and are not secure
            in any real-world sense.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs text-slate-300">Recovered plaintext</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Plaintext
          </Button>
          {feedback && <p className="text-sm text-slate-200">{feedback}</p>}
        </div>
      </div>
    </div>
  );
}

function SimpleBinaryLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{binary_analyzed}') {
      setFeedback('Correct flag extracted from the binary.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{binary_analyzed}');
      }
    } else {
      setFeedback('Incorrect flag. Re-analyze the downloaded artifact.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 6: Simple Binary (Reverse Engineering)</h2>
        <p className="text-slate-400 text-sm">
          Download the compiled artifact, inspect its behavior or strings, and recover the embedded
          flag.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/labs/artifacts/simple-binary.txt"
          download
          className="inline-flex items-center justify-center rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          Download binary artifact (text-encoded demo)
        </a>
        <p className="text-xs text-slate-400">
          The download contains a text-encoded representation of a simple program. In a real event
          this would be an actual compiled binary; here it is provided in a portable format.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Extracted flag</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Flag
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}
      </div>
    </div>
  );
}

function MemoryLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{memory_extracted}') {
      setFeedback('Correct flag recovered from the memory dump.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{memory_extracted}');
      }
    } else {
      setFeedback('Incorrect flag. Check your strings and analysis again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 7: Memory Dump Analysis</h2>
        <p className="text-slate-400 text-sm">
          Download the simulated memory dump, inspect it with your favorite tools, and locate the
          flag.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/labs/artifacts/memory-dump.txt"
          download
          className="inline-flex items-center justify-center rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          Download memory dump (text demo)
        </a>
        <p className="text-xs text-slate-400">
          Use tools like <span className="font-mono">strings</span> or memory forensics frameworks
          to search for flag-like patterns.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Recovered flag</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Flag
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}
      </div>
    </div>
  );
}

function PacketLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{packet_found}') {
      setFeedback('Correct flag recovered from the PCAP.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{packet_found}');
      }
    } else {
      setFeedback('Incorrect flag. Check your reconstructed streams again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab 8: Packet Analysis</h2>
        <p className="text-slate-400 text-sm">
          Download the simulated packet capture, open it in Wireshark or a similar tool, and search
          for the exfiltrated flag.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/labs/artifacts/traffic.pcap.txt"
          download
          className="inline-flex items-center justify-center rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          Download PCAP (text-encoded demo)
        </a>
        <p className="text-xs text-slate-400">
          In a real event this would be a binary <span className="font-mono">.pcap</span> file. For
          portability, this lab uses a text-encoded representation containing the same information.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Recovered flag</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Flag
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}
      </div>
    </div>
  );
}

function LogFileInvestigationLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{breach_detected}') {
      setFeedback('Correct flag recovered from the server logs.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{breach_detected}');
      }
    } else {
      setFeedback('Incorrect flag. Analyze the log entries carefully, especially suspicious requests.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab: Log File Investigation</h2>
        <p className="text-slate-400 text-sm">
          Download the server log file and analyze it for evidence of a security breach. Look for
          suspicious requests and extract the flag.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/labs/artifacts/server.log.txt"
          download
          className="inline-flex items-center justify-center rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          Download Server Log
        </a>
        <p className="text-xs text-slate-400">
          Analyze the log entries for suspicious activity. Look for SQL injection attempts, unusual
          parameters, or encoded tokens in the requests.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Recovered flag</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Flag
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}

        <div className="border-t border-slate-700 pt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            {showHint ? '▼ Hide' : '▶ Show'} Hint
          </button>

          {showHint && (
            <div className="mt-4 bg-slate-700 rounded p-4 space-y-3">
              <p className="text-slate-300 text-sm">
                <strong>Hint:</strong> Look for suspicious requests in the log file, particularly those with unusual parameters or tokens.
              </p>
              <p className="text-slate-300 text-sm">
                Some data in web requests may be encoded. Try using a <strong>base64 decoder</strong> to decode any encoded tokens or parameters you find in the log entries.
              </p>
              <p className="text-slate-300 text-sm">
                Common tools for log analysis: grep, awk, sed, or online base64 decoders. Look for patterns that don't match normal web traffic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiskImageRecoveryLab({
  onSolved,
  currentFlag,
  status,
}: {
  onSolved: (flag: string) => Promise<void>;
  currentFlag: string | null;
  status: LabStatus;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (answer.trim() === 'flag{your_hidden_flag}') {
      setFeedback('Correct flag recovered from the disk image.');
      if (status !== 'completed' && !currentFlag) {
        await onSolved('flag{your_hidden_flag}');
      }
    } else {
      setFeedback('Incorrect flag. Try using the strings command to extract readable text from the ISO file, then search for flag patterns.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Lab: Disk Image Recovery</h2>
        <p className="text-slate-400 text-sm">
          A disk image from a compromised system has been recovered. The attacker attempted to delete sensitive information,
          but traces may still remain. Use forensic techniques to recover the hidden flag from the disk image.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/labs/artifacts/1mb.iso"
          download
          className="inline-flex items-center justify-center rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          Download Disk Image (1mb.iso)
        </a>
        <p className="text-xs text-slate-400">
          Binary files like disk images often contain readable text strings embedded within them. Try using the <span className="font-mono">strings</span> command
          (or <span className="font-mono">strings.exe</span> on Windows) to extract printable text from the ISO file. You can then search through the output
          for flag-like patterns.
        </p>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Recovered flag</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white font-mono"
            placeholder="flag{...}"
          />
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
          >
            Submit Flag
          </Button>
        </div>

        {feedback && <p className="text-sm text-slate-200">{feedback}</p>}

        <div className="border-t border-slate-700 pt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            {showHint ? '▼ Hide' : '▶ Show'} Hint
          </button>

          {showHint && (
            <div className="mt-4 bg-slate-700 rounded p-4 space-y-3">
              <p className="text-slate-300 text-sm">
                <strong>Hint:</strong> The <span className="font-mono">strings</span> command extracts readable ASCII text from binary files.
                This is perfect for finding text that's embedded in disk images or other binary formats.
              </p>
              <p className="text-slate-300 text-sm">
                On Windows, you can use: <span className="font-mono">strings.exe 1mb.iso</span> to extract all readable strings.
                On Linux/Mac, use: <span className="font-mono">strings 1mb.iso</span>
              </p>
              <p className="text-slate-300 text-sm">
                Since the output might be long, you can pipe it through a filter. The flag contains the word "hidden" in it.
                Try using <span className="font-mono">findstr</span> (Windows) or <span className="font-mono">grep</span> (Linux/Mac) to search for lines containing "hidden".
              </p>
              <p className="text-slate-300 text-sm">
                <strong>Example:</strong> <span className="font-mono">strings.exe 1mb.iso | findstr hidden</span> (Windows) or
                <span className="font-mono"> strings 1mb.iso | grep hidden</span> (Linux/Mac)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LabPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <LabPageContent />
    </Suspense>
  );
}
