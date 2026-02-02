'use client';

import { useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LeaderboardEntry extends User {
  solved_count: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Fetch users with their solve counts
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('total_score', { ascending: false });

      if (usersError) throw usersError;

      // Fetch solve counts for each user
      const leaderboardData = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: solvesData } = await supabase
            .from('solves')
            .select('id')
            .eq('user_id', user.id);

          return {
            ...user,
            solved_count: solvesData?.length || 0,
          };
        })
      );

      // Sort by total_score descending
      leaderboardData.sort((a, b) => b.total_score - a.total_score);

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400">Loading leaderboard...</p>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-slate-400">Top performers in the CTF competition</p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 whitespace-nowrap"
            >
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 bg-slate-700/50">
                  <TableHead className="text-slate-300">Rank</TableHead>
                  <TableHead className="text-slate-300">Username</TableHead>
                  <TableHead className="text-slate-300">Team</TableHead>
                  <TableHead className="text-slate-300">Year</TableHead>
                  <TableHead className="text-slate-300 text-right">Points</TableHead>
                  <TableHead className="text-slate-300 text-right">Solves</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.id} className="border-slate-700 hover:bg-slate-700/50 transition">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg w-8">{index + 1}</span>
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-medium">{entry.username}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {entry.team_name || 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{entry.year}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-blue-400 font-bold text-lg">{entry.total_score}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-400 font-bold">{entry.solved_count}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {leaderboard.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No participants yet. Be the first to register!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
