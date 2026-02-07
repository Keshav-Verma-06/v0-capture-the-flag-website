"use client";

import { useState, Suspense, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FLAG_VALUE = "flag{sunday_gustave_eiffel}";
const CORRECT_WEEKDAY = "sunday";

function LandmarkTimelineLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges";
  const backText = challengeId ? "Back to Challenge" : "Back to Challenges";

  const [weekday, setWeekday] = useState("");
  const [engineer, setEngineer] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [flagVisible, setFlagVisible] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedWeekday = weekday.trim().toLowerCase();
    const normalizedEngineer = engineer.trim().toLowerCase();

    if (!normalizedWeekday || !normalizedEngineer) {
      setMessage({
        type: "error",
        text: "Provide both the weekday and the engineer name before submitting.",
      });
      setFlagVisible(false);
      return;
    }

    const engineerMatches =
      normalizedEngineer.includes("gustave") &&
      normalizedEngineer.includes("eiffel");

    const isCorrect = normalizedWeekday === CORRECT_WEEKDAY && engineerMatches;

    if (isCorrect) {
      setMessage({
        type: "success",
        text: "Correct! You correlated the historical details accurately.",
      });
      setFlagVisible(true);
    } else {
      setMessage({
        type: "error",
        text: "Not quite. Double-check the public opening date and who oversaw the build.",
      });
      setFlagVisible(false);
    }
  };

  const handleReset = () => {
    setWeekday("");
    setEngineer("");
    setMessage(null);
    setFlagVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={backHref}>
            <Button
              variant="outline"
              className="mb-4 border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              ← {backText}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Landmark + Timeline Correlation Lab
          </h1>
          <p className="text-slate-300">
            Practice timeline correlation on the Eiffel Tower using only open
            historical sources.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">
              Research Checklist
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                • Confirm the public opening date for the Eiffel Tower in 1889.
                <li>
                  • The 1889 Exposition Universelle guidebooks and
                  contemporaneous newspapers document the tower's phased
                  opening.
                </li>
              </li>
              <li>• Cross-reference at least two independent open sources.</li>
            </ul>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-emerald-300 mb-4">
              Submit Your Correlation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Weekday of the public opening
                </label>
                <select
                  value={weekday}
                  onChange={(event) => setWeekday(event.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="">Select weekday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Chief engineer name
                </label>
                <Input
                  value={engineer}
                  onChange={(event) => setEngineer(event.target.value)}
                  placeholder="e.g., Gustave Eiffel"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              {message && (
                <div
                  className={`rounded border p-4 text-sm ${
                    message.type === "success"
                      ? "border-green-500/40 bg-green-500/10 text-green-200"
                      : "border-red-500/40 bg-red-500/10 text-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Check Answer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-600 text-slate-200 hover:bg-slate-800"
                >
                  Reset
                </Button>
              </div>
            </form>

            {flagVisible && (
              <div className="mt-6 rounded border border-emerald-500/40 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200 mb-2">
                  ✓ Flag unlocked — submit it on the challenge page.
                </p>
                <code className="block font-mono text-lg text-emerald-300">
                  {FLAG_VALUE}
                </code>
              </div>
            )}
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Hints
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                • The 1889 Exposition Universelle guidebooks and contemporaneous
                newspapers document the tower’s phased opening.
              </li>
              <li>
                • Use an online perpetual calendar to map 6 May 1889 to its
                weekday.
              </li>
              <li>
                • Gustave Eiffel's company led the project, with Eiffel named in
                official inauguration accounts.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LandmarkTimelineLab() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <LandmarkTimelineLabContent />
    </Suspense>
  );
}
