'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InternalFlagPage() {
  const FLAG = 'flag{dns_enumerated}';
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    init();
  }, []);

  const handleSubmitFlag = async () => {
    if (!userId) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to submit the flag.',
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('title', 'DNS Enumeration')
        .single();

      if (challengeError || !challengeData) {
        throw new Error('Challenge not found in database');
      }

      const isCorrect = FLAG.toLowerCase() === (challengeData.flag_hash || '').toLowerCase();

      const { error: submitError } = await supabase.from('submissions').insert({
        user_id: userId,
        challenge_id: challengeData.id,
        flag_submitted: FLAG,
        is_correct: isCorrect,
      });

      if (submitError) throw submitError;

      if (isCorrect) {
        const { data: existingSolve } = await supabase
          .from('solves')
          .select('id')
          .eq('user_id', userId)
          .eq('challenge_id', challengeData.id)
          .maybeSingle();

        if (!existingSolve) {
          const { error: solveError } = await supabase.from('solves').insert({
            user_id: userId,
            challenge_id: challengeData.id,
            solve_time: new Date().toISOString(),
          });

          if (solveError) throw solveError;

          await supabase.rpc('update_user_score', {
            p_user_id: userId,
            p_points: challengeData.points,
          });
        }

        setMessage({
          type: 'success',
          text: `✓ Correct! You earned ${challengeData.points} points! Check your score on the leaderboard.`,
        });
        setSubmitted(true);
      } else {
        setMessage({
          type: 'error',
          text: 'Flag mismatch in database.',
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'Failed to submit flag',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HTTP Response */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8">
            <div className="font-mono text-sm space-y-3 mb-6">
              <p className="text-green-400 font-semibold">HTTP/1.1 200 OK</p>
              <p className="text-slate-400">Server: internal-flag-host/1.0</p>
              <p className="text-slate-400">X-Service-Type: Confidential</p>
              <p className="text-slate-400">Content-Type: text/plain; charset=utf-8</p>
              <p className="text-slate-400">Connection: close</p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded p-4 my-6">
              <p className="text-emerald-300 font-mono text-lg font-bold">{FLAG}</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSubmitFlag}
                disabled={submitting || submitted}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {submitting ? 'Submitting...' : submitted ? '✓ Submitted' : 'Submit Flag'}
              </Button>

              {message && (
                <div
                  className={`p-3 rounded border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <p className="font-mono text-sm">{message.text}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Security Note */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📝 Security Note</h3>
            <p className="text-slate-400 text-sm">
              Internal services are typically less protected than public-facing endpoints. Often, debugging information, configuration details, and sensitive tokens are exposed in internal namespaces that are assumed to be protected by network segmentation alone.
            </p>
            <p className="text-slate-400 text-sm mt-2">
              This is a critical security principle: <span className="font-semibold text-slate-300">never rely solely on namespacing or obscurity</span> to protect sensitive data. Always apply defense-in-depth principles.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
