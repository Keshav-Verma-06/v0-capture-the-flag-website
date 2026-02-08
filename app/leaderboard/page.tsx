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
  calculated_score: number;
  solved_challenges: number[];
}

interface TeamLeaderboardEntry {
  team_name: string;
  total_score: number;
  total_solves: number;
  member_count: number;
  members: string[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // Fetch solve counts and calculate points for each user
      const leaderboardData = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: solvesData } = await supabase
            .from('solves')
            .select('challenge_id')
            .eq('user_id', user.id);

          const solvedCount = solvesData?.length || 0;
          
          // Calculate total points from solved challenges (same as dashboard)
          let totalPoints = 0;
          const challengeIds: number[] = solvesData?.map((s) => s.challenge_id) || [];
          if (challengeIds.length > 0) {
            const { data: challengesData } = await supabase
              .from('challenges')
              .select('points')
              .in('id', challengeIds);

            totalPoints = challengesData?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
          }

          return {
            ...user,
            solved_count: solvedCount,
            calculated_score: totalPoints,
            solved_challenges: challengeIds,
          };
        })
      );

      // Sort by calculated_score descending
      leaderboardData.sort((a, b) => (b.calculated_score ?? 0) - (a.calculated_score ?? 0));

      setLeaderboard(leaderboardData);

      // Calculate team leaderboard
      // Build per-team sets of unique solved challenge IDs and member lists
      const teamMap = new Map<string, {
        members: string[];
        challengeIds: Set<number>;
      }>();

      leaderboardData.forEach((user) => {
        if (user.team_name) {
          const teamName = user.team_name;
          if (!teamMap.has(teamName)) {
            teamMap.set(teamName, {
              members: [],
              challengeIds: new Set<number>(),
            });
          }
          const team = teamMap.get(teamName)!;
          team.members.push(user.username);
          (user.solved_challenges || []).forEach((id: number) => team.challengeIds.add(id));
        }
      });

      // For each team, fetch unique challenge points and compute totals
      const teamLeaderboardData: TeamLeaderboardEntry[] = [];
      for (const [team_name, data] of Array.from(teamMap.entries())) {
        const uniqueIds = Array.from(data.challengeIds);
        let totalScore = 0;
        if (uniqueIds.length > 0) {
          const { data: challengesData } = await supabase
            .from('challenges')
            .select('id, points')
            .in('id', uniqueIds);

          totalScore = challengesData?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
        }

        teamLeaderboardData.push({
          team_name,
          total_score: totalScore,
          total_solves: uniqueIds.length,
          member_count: data.members.length,
          members: data.members,
        });
      }

      // Sort teams by total_score desc
      teamLeaderboardData.sort((a, b) => b.total_score - a.total_score);

      setTeamLeaderboard(teamLeaderboardData);
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

        {/* Tabs for Individual and Team Leaderboard */}
        <div className="mb-6 flex gap-2 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'individual'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'team'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Teams
          </button>
        </div>

        {/* Individual Leaderboard */}
        {activeTab === 'individual' && (
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
                      <span className="text-blue-400 font-bold text-lg">
                        {entry.calculated_score ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-400 font-bold">{entry.solved_count ?? 0}</span>
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
        )}

        {/* Team Leaderboard */}
        {activeTab === 'team' && (
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 bg-slate-700/50">
                    <TableHead className="text-slate-300">Rank</TableHead>
                    <TableHead className="text-slate-300">Team Name</TableHead>
                    <TableHead className="text-slate-300">Members</TableHead>
                    <TableHead className="text-slate-300 text-right">Total Points</TableHead>
                    <TableHead className="text-slate-300 text-right">Total Solves</TableHead>
                    <TableHead className="text-slate-300 text-right">Avg Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamLeaderboard.map((team, index) => (
                    <TableRow key={team.team_name} className="border-slate-700 hover:bg-slate-700/50 transition">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg w-8">{index + 1}</span>
                          {index === 0 && <span className="text-2xl">🏆</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-base px-3 py-1">
                          {team.team_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-medium">{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</span>
                          <span className="text-slate-400 text-xs">{team.members.join(', ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-blue-400 font-bold text-lg">
                          {team.total_score}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-400 font-bold">{team.total_solves}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-slate-300 font-medium">
                          {team.member_count > 0 ? Math.round(team.total_score / team.member_count) : 0}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {teamLeaderboard.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No teams yet. Create a team during registration!
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
