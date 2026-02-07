"use client";

import { useState, Suspense, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TARGET_TAIL = "N212UA";
const TARGET_YEAR = "1995";
const FLAG_VALUE = "flag{n212ua_1995}";

type MessageState = { type: "success" | "error"; text: string } | null;

const diversions = [
  {
    date: "2023-03-04",
    flight: "UA149",
    route: "Newark (EWR) → Delhi (DEL)",
    diversion: "Emergency diversion to Bangor (BGR)",
    registration: "N212UA",
  },
  {
    date: "2023-07-13",
    flight: "UA35",
    route: "San Francisco (SFO) → Sydney (SYD)",
    diversion: "Weather delay via Pago Pago (PPG)",
    registration: "N2747U",
  },
  {
    date: "2023-11-06",
    flight: "UA830",
    route: "Guam (GUM) → Honolulu (HNL)",
    diversion: "Technical diversion to Midway (MDY)",
    registration: "N210UA",
  },
];

function normalizeTail(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function AviationRegistriesLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges";
  const backText = challengeId ? "Back to Challenge" : "Back to Challenges";

  const [tailNumber, setTailNumber] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [flagVisible, setFlagVisible] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedTail = normalizeTail(tailNumber);
    const normalizedYear = manufactureYear.trim();

    if (!normalizedTail || !normalizedYear) {
      setMessage({
        type: "error",
        text: "Provide both the tail number and the aircraft manufacture year.",
      });
      setFlagVisible(false);
      return;
    }

    const tailMatches = normalizedTail === TARGET_TAIL;
    const yearMatches = normalizedYear === TARGET_YEAR;

    if (tailMatches && yearMatches) {
      setMessage({
        type: "success",
        text: "Correct! You verified the airframe involved in the 2023 diversion.",
      });
      setFlagVisible(true);
    } else if (tailMatches) {
      setMessage({
        type: "error",
        text: "Tail number is right, but double-check the airframe history for the manufacture year.",
      });
      setFlagVisible(false);
    } else if (yearMatches) {
      setMessage({
        type: "error",
        text: "The year matches, but confirm the exact United Airlines registration from flight-tracking archives.",
      });
      setFlagVisible(false);
    } else {
      setMessage({
        type: "error",
        text: "Not quite. Review 2023 diversion reports and cross-reference with FAA and ICAO registries.",
      });
      setFlagVisible(false);
    }
  };

  const handleReset = () => {
    setTailNumber("");
    setManufactureYear("");
    setNotes("");
    setMessage(null);
    setFlagVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href={backHref}>
            <Button
              variant="outline"
              className="mb-6 border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              ← {backText}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Aviation + Open Registries Lab
          </h1>
          <p className="text-slate-300">
            Reconstruct the aircraft details from a 2023 United Airlines Boeing
            777 diversion using publicly available trackers and registries.
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">
            Investigation Trail
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            The table below summarises three 2023 Boeing 777 incidents. Only one
            matches the high-profile emergency diversion highlighted in the
            challenge prompt.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Flight</th>
                  <th className="px-4 py-2">Route</th>
                  <th className="px-4 py-2">Diversion</th>
                  <th className="px-4 py-2">Reported tail</th>
                </tr>
              </thead>
              <tbody>
                {diversions.map((entry) => (
                  <tr
                    key={entry.flight}
                    className="odd:bg-slate-900 even:bg-slate-800/60"
                  >
                    <td className="px-4 py-2 font-mono text-slate-200">
                      {entry.date}
                    </td>
                    <td className="px-4 py-2 font-medium text-slate-100">
                      {entry.flight}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.route}
                    </td>
                    <td className="px-4 py-2">{entry.diversion}</td>
                    <td className="px-4 py-2 font-mono text-emerald-300">
                      {entry.registration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">
            Submit Your Findings
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tail number (registration)
              </label>
              <Input
                value={tailNumber}
                onChange={(event) => setTailNumber(event.target.value)}
                placeholder="Enter the registration tail (e.g., N#####)"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Manufacture year
              </label>
              <Input
                value={manufactureYear}
                onChange={(event) => setManufactureYear(event.target.value)}
                placeholder="Enter the four-digit manufacture year"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Source notes (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Log the tracker URLs, registry filings, or aircraft history references you consulted."
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
                Verify Registration
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
            Research Hints
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              FlightAware and FlightRadar24 keep historical diversion records
              with registration fields.
            </li>
            <li>
              FAA registry entries list manufacture dates alongside serial
              numbers for US-based airframes.
            </li>
            <li>
              Planespotters.net and ATDB provide delivery timelines that
              corroborate manufacture years.
            </li>
            <li>
              Cross-validate with press releases or NTSB reference numbers to
              ensure the diversion matches the correct incident.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default function AviationRegistriesLab() {
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
      <AviationRegistriesLabContent />
    </Suspense>
  );
}
