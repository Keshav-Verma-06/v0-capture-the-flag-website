'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, User, Challenge } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [teamScore, setTeamScore] = useState<number | null>(null);
  const [recentSolves, setRecentSolves] = useState<
    Array<{
      id: string;
      challenge_id: string;
      solve_time: string;
      challenge?: Challenge;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push('/login');
        return;
      }

      fetchUserData(authData.user.id);
    };

    checkAuth();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      setUser(userData);

      // Fetch solved challenges
      const { data: solvesData, error: solvesError } = await supabase
        .from('solves')
        .select('*')
        .eq('user_id', userId)
        .order('solve_time', { ascending: false });

      if (solvesError) throw solvesError;

      setSolvedCount(solvesData?.length || 0);

      // Fetch total points from challenges
      if (solvesData && solvesData.length > 0) {
        const { data: challengesData } = await supabase
          .from('challenges')
          .select('id, points')
          .in(
            'id',
            solvesData.map((s) => s.challenge_id)
          );

        const total = challengesData?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
        setTotalPoints(total);
      }

      // If user has a team, compute team score using unique challenge IDs across members
      if (userData.team_name) {
        try {
          const { data: teamMembers } = await supabase
            .from('users')
            .select('id, username')
            .eq('team_name', userData.team_name);

          const memberIds = (teamMembers || []).map((m: any) => m.id);

          if (memberIds.length > 0) {
            const { data: teamSolves } = await supabase
              .from('solves')
              .select('challenge_id')
              .in('user_id', memberIds);

            const uniqueIds = Array.from(new Set((teamSolves || []).map((s: any) => s.challenge_id)));

            if (uniqueIds.length > 0) {
              const { data: teamChallenges } = await supabase
                .from('challenges')
                .select('id, points')
                .in('id', uniqueIds);

              const teamTotal = teamChallenges?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
              setTeamScore(teamTotal);
            } else {
              setTeamScore(0);
            }
          } else {
            setTeamScore(0);
          }
        } catch (err) {
          console.error('Error computing team score:', err);
          setTeamScore(null);
        }
      } else {
        setTeamScore(null);
      }

      // Fetch recent solves with challenge details
      const { data: recentSolvesData } = await supabase
        .from('solves')
        .select(
          `
          id,
          challenge_id,
          solve_time,
          challenges(title, points)
        `
        )
        .eq('user_id', userId)
        .order('solve_time', { ascending: false })
        .limit(5);

      if (recentSolvesData) {
        setRecentSolves(
          recentSolvesData.map((s: any) => ({
            id: s.id,
            challenge_id: s.challenge_id,
            solve_time: s.solve_time,
            challenge: s.challenges,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.username}</h1>
            <p className="text-slate-400">Keep solving challenges to climb the leaderboard!</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Total Points</div>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-blue-400">{totalPoints}</div>

              <div className="relative group">
                <div
                  className="w-7 h-7 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-xs text-slate-200 font-semibold shadow-sm hover:bg-slate-700"
                  aria-hidden
                >
                  i
                </div>

                <div
                  className="pointer-events-none absolute right-0 bottom-full mb-3 w-64 rounded-md bg-slate-800 border border-slate-700 p-3 text-sm text-slate-200 shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150"
                  role="tooltip"
                >
                  <div className="font-medium text-sm text-white mb-1">How team points work</div>
                  <div className="text-slate-300 text-xs">
                    Only unique challenge points are counted once per team. If multiple members solve the same
                    challenge, its points are counted only one time for the team. Team solves are the number of
                    unique challenges solved by the team.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Challenges Solved</div>
            <div className="text-4xl font-bold text-green-400">{solvedCount}</div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Team</div>
            <div className="text-xl font-bold text-purple-400 flex items-center gap-3">
              <span>{user?.team_name || 'Individual'}</span>
              {user?.team_name && teamScore != null && (
                <span className="text-sm bg-purple-600/20 text-purple-200 px-2 py-1 rounded">
                  {teamScore} pts
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Solves */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Recent Solves</h2>
              </div>
              <div className="divide-y divide-slate-700">
                {recentSolves.length > 0 ? (
                  recentSolves.map((solve) => (
                    <div key={solve.id} className="p-4 hover:bg-slate-700/50 transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">
                            {(solve.challenge as any)?.title || 'Unknown Challenge'}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(solve.solve_time).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          +{(solve.challenge as any)?.points || 0} pts
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    No solves yet. Start solving challenges!
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/challenges" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Challenges
                  </Button>
                </Link>
                <Link href="/leaderboard" className="block">
                  <Button
                    variant="outline"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                  >
                    Leaderboard
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-3">Profile Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-400">Username</p>
                  <p className="text-white font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-slate-400">Year</p>
                  <p className="text-white font-medium">{user?.year}</p>
                </div>
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="text-white font-medium text-xs break-all">{user?.email}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
