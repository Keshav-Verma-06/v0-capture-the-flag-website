'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Challenge, Lab } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) throw error;

      setChallenge(data);
      checkIfSolved(data.id);
      fetchLabForChallenge(data.id);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabForChallenge = async (cId: string) => {
    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .eq('challenge_id', cId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching lab for challenge:', error);
        return;
      }

      setLab(data as Lab);
    } catch (error) {
      console.error('Error fetching lab for challenge:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const checkIfSolved = async (cId: string) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data } = await supabase
        .from('solves')
        .select('id')
        .eq('challenge_id', cId)
        .eq('user_id', authData.user.id)
        .single();

      setIsSolved(!!data);
    } catch (error) {
      console.log('Not yet solved');
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !challenge || !flag.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      // Check if flag is correct (simple comparison for demo)
      const isCorrect = flag.trim().toLowerCase() === challenge.flag_hash.toLowerCase();

      // Record submission
      const { error: submitError } = await supabase.from('submissions').insert({
        user_id: userId,
        challenge_id: challenge.id,
        flag_submitted: flag,
        is_correct: isCorrect,
      });

      if (submitError) throw submitError;

      if (isCorrect) {
        // Record solve
        const { error: solveError } = await supabase.from('solves').insert({
          user_id: userId,
          challenge_id: challenge.id,
          solve_time: new Date().toISOString(),
        });

        if (solveError) throw solveError;

        setMessage({ type: 'success', text: `🎉 Correct! You earned ${challenge.points} points!` });
        setIsSolved(true);
        setFlag('');

        // Update user score
        await supabase.rpc('update_user_score', {
          p_user_id: userId,
          p_points: challenge.points,
        });
      } else {
        setMessage({ type: 'error', text: 'Incorrect flag. Try again!' });
        setFlag('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to submit flag',
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
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/challenges" className="text-blue-400 hover:text-blue-300 mb-6 block">
          ← Back to Challenges
        </Link>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{challenge.title}</h1>
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
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-slate-300 whitespace-pre-wrap">
                {challenge.full_description || challenge.description}
              </p>
            </div>

            {lab && (
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm text-slate-400">
                  This challenge has an interactive lab environment where you can exploit the
                  vulnerability directly.
                </p>
                <Link href={`/labs/${lab.slug}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Go to Lab
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 italic">
                  Labs are intentionally vulnerable and fully isolated. Use them only for learning.
                </p>
              </div>
            )}

            {challenge.resources && Object.keys(challenge.resources).length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Resources</h2>
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
              <h2 className="text-2xl font-bold text-white mb-6">Submit Flag</h2>

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
                      message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}
                  >
                    <p
                      className={
                        message.type === 'success'
                          ? 'text-green-400'
                          : 'text-red-400'
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
                  {submitting ? 'Submitting...' : 'Submit Flag'}
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
