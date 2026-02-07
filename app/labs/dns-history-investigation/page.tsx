"use client";

import { useState, Suspense, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FLAG_VALUE = "flag{may_2022}";

type MessageState = { type: "success" | "error"; text: string } | null;

const referenceTimeline = [
  {
    date: "March 2020",
    item: "WHO declares COVID-19 a pandemic",
    source: "Press briefing transcripts",
  },
  {
    date: "May 2021",
    item: "Executive Board recommends nomination renewal",
    source: "Executive Board EB148/CONF./2",
  },
  {
    date: "May 2022",
    item: "World Health Assembly confirms the second term",
    source: "Press release and archived newsroom page",
  },
  {
    date: "August 2022",
    item: "New mandate formally begins",
    source: "Leadership biography update",
  },
];

function normalizeMonth(input: string) {
  return input.trim().toLowerCase();
}

function OrganizationalChangeLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges";
  const backText = challengeId ? "Back to Challenge" : "Back to Challenges";

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [flagVisible, setFlagVisible] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedMonth = normalizeMonth(month);
    const normalizedYear = year.trim();

    if (!normalizedMonth || !normalizedYear) {
      setMessage({
        type: "error",
        text: "Capture both the month and year before submitting your findings.",
      });
      setFlagVisible(false);
      return;
    }

    const monthMatches = ["may"].includes(normalizedMonth);
    const yearMatches = normalizedYear === "2022";

    if (monthMatches && yearMatches) {
      setMessage({
        type: "success",
        text: "Confirmed. The World Health Assembly renewed the mandate at that time.",
      });
      setFlagVisible(true);
    } else if (monthMatches) {
      setMessage({
        type: "error",
        text: "The month matches. Revisit WHO press releases to verify the year announced in Geneva.",
      });
      setFlagVisible(false);
    } else if (yearMatches) {
      setMessage({
        type: "error",
        text: "Solid year. Cross-check archived newsroom pages for the specific month.",
      });
      setFlagVisible(false);
    } else {
      setMessage({
        type: "error",
        text: "Not quite. Align Executive Board recommendations with World Health Assembly voting records.",
      });
      setFlagVisible(false);
    }
  };

  const handleReset = () => {
    setMonth("");
    setYear("");
    setNotes("");
    setMessage(null);
    setFlagVisible(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href={backHref}>
            <Button
              variant="outline"
              className="mb-4 border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              ← {backText}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Organizational Change Tracking Lab
          </h1>
          <p className="text-slate-300">
            Track leadership renewals at the World Health Organization by
            blending press releases, Executive Board documents, and archived
            webpages.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">
            Timeline Snippets
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            These excerpts mirror the types of artifacts you would collect.
            Validate each against official WHO newsroom posts and World Health
            Assembly records.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Event</th>
                  <th className="px-4 py-2">Source cues</th>
                </tr>
              </thead>
              <tbody>
                {referenceTimeline.map((entry) => (
                  <tr
                    key={entry.date}
                    className="odd:bg-slate-950 even:bg-slate-900/80"
                  >
                    <td className="px-4 py-2 font-mono text-slate-200">
                      {entry.date}
                    </td>
                    <td className="px-4 py-2 text-slate-100">{entry.item}</td>
                    <td className="px-4 py-2 text-slate-400">{entry.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">
            Submit Renewal Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Renewal month
              </label>
              <Input
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                placeholder="Enter the month (e.g., January)"
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Renewal year
              </label>
              <Input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="Enter the four-digit year"
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Evidence log (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Summarize press release URLs, World Health Assembly resolutions, or archived snapshots."
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {message && (
              <div
                className={`rounded border p-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
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
                Verify Renewal
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
                onClick={handleReset}
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

        <Card className="bg-slate-900 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            Research Hints
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              Consult the WHO newsroom archive and filter for leadership
              announcements.
            </li>
            <li>
              Compare dates with World Health Assembly agendas and voting
              records.
            </li>
            <li>
              Use the Wayback Machine to confirm what the leadership biography
              displayed that week.
            </li>
            <li>
              Cross-reference with major news outlets for independent
              confirmation of the renewal.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default function OrganizationalChangeLab() {
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
      <OrganizationalChangeLabContent />
    </Suspense>
  );
}
