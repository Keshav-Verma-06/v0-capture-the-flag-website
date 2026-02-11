"use client";

import { useState, useEffect } from "react";
import { supabase, Challenge } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const hiddenChallengeTitles = new Set(["Social Media Profiling"]);

const challengeOverrides: Record<
  string,
  { title?: string; description?: string }
> = {
  "Hash Collision": {
    title: "XOR Repeating Key",
    description: "Break a repeating-key XOR cipher",
  },
  "GitHub Recon": {
    title: "Landmark + Timeline Correlation",
    description:
      "Identify the weekday the Eiffel Tower opened to the public and name its chief engineer using open sources.",
  },
  "Subdomain Enumeration": {
    title: "Corporate Footprint Reconstruction",
    description:
      "Determine SpaceX's registered office address at the time of the first Falcon 9 launch using open data only.",
  },
  "IP Geolocation": {
    title: "Aviation + Open Registries",
    description:
      "Identify the United Airlines 777 tail number from a 2023 diversion and confirm its manufacture year via public records.",
  },
  "DNS History Investigation": {
    title: "Organizational Change Tracking",
    description:
      "Find the month and year the WHO renewed its current Director-General during the COVID era using open reports.",
  },
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    fetchChallenges();
    fetchSolvedChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;

      setChallenges(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map((c) => c.category) || [])];
      setCategories(uniqueCategories);
      setExpandedCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvedChallenges = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data, error } = await supabase
        .from("solves")
        .select("challenge_id")
        .eq("user_id", authData.user.id);

      if (error) throw error;

      const solvedIds = new Set(data?.map((s) => s.challenge_id) || []);
      setSolvedChallenges(solvedIds);
    } catch (error) {
      console.error("Error fetching solved challenges:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400">Loading challenges...</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Challenges</h1>
            <p className="text-slate-400">
              Solve challenges by category to earn points
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border border-slate-500 bg-slate-900 text-slate-100 px-4 py-2 rounded-md 
hover:bg-slate-700 hover:border-slate-400 transition whitespace-nowrap"
            >
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const categoryProblems = challenges.filter(
              (c) =>
                c.category === category && !hiddenChallengeTitles.has(c.title),
            );

            return (
              <Collapsible
                key={category}
                open={expandedCategories.includes(category)}
                onOpenChange={() => toggleCategory(category)}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CollapsibleTrigger asChild>
                    <button className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">
                          {category}
                        </h2>
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {categoryProblems.length} problems
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedCategories.includes(category)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                      <div className="grid gap-3">
                        {categoryProblems.map((challenge) => (
                          <Card
                            key={challenge.id}
                            className="bg-slate-700/50 border-slate-600 hover:border-blue-500/50 transition"
                          >
                            <div className="p-4 flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-white">
                                    {challengeOverrides[challenge.title]
                                      ?.title ?? challenge.title}
                                  </h3>
                                  {solvedChallenges.has(challenge.id) && (
                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                      ✓ Solved
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-400 text-sm mb-3">
                                  {challengeOverrides[challenge.title]
                                    ?.description ?? challenge.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`border ${getDifficultyColor(challenge.difficulty)}`}
                                    variant="outline"
                                  >
                                    {challenge.difficulty}
                                  </Badge>
                                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    {challenge.points} pts
                                  </Badge>
                                </div>
                              </div>
                              <Link
                                href={`/challenges/${challenge.id}`}
                                className="ml-4"
                              >
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                  Solve
                                </Button>
                              </Link>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
