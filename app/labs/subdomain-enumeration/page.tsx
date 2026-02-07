"use client";

import { useState, Suspense, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FLAG_VALUE = "flag{1_rocket_road_hawthorne_ca}";

const ACCEPTED_VARIANTS = [
  "1rocketroadhawthorneca",
  "1rocketroadhawthorneca90250",
  "1rocketroadhawthornecalifornia",
  "1rocketroadhawthornecalifornia90250",
  "onerocketroadhawthorneca",
  "onerocketroadhawthorneca90250",
  "onerocketroadhawthornecalifornia",
  "onerocketroadhawthornecalifornia90250",
];

function normalizeAddress(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function CorporateFootprintLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const backHref = challengeId ? `/challenges/${challengeId}` : "/challenges";
  const backText = challengeId ? "Back to Challenge" : "Back to Challenges";

  const [address, setAddress] = useState("");
  const [sources, setSources] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [flagVisible, setFlagVisible] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedAddress = normalizeAddress(address);

    if (!normalizedAddress) {
      setMessage({
        type: "error",
        text: "Document the full registered office address before submitting.",
      });
      setFlagVisible(false);
      return;
    }

    const matches = ACCEPTED_VARIANTS.some((variant) =>
      normalizedAddress.includes(variant),
    );

    if (matches) {
      setMessage({
        type: "success",
        text: "Correct! You traced the 2010 registered office for SpaceX.",
      });
      setFlagVisible(true);
    } else {
      setMessage({
        type: "error",
        text: "Not quite. Verify the corporate filings around the 2010 launch date.",
      });
      setFlagVisible(false);
    }
  };

  const handleReset = () => {
    setAddress("");
    setSources("");
    setMessage(null);
    setFlagVisible(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
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
            Corporate Footprint Reconstruction Lab
          </h1>

          <p className="text-slate-300">
            Use open data to reconstruct SpaceX&apos;s registered office at the
            time of the first Falcon 9 launch in 2010.
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">
            Research Toolkit
          </h2>

          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              Review SEC EDGAR filings and historical business registrations.
            </li>
            <li>
              Confirm launch coverage in archived June 2010 press releases.
            </li>
            <li>Cross-reference with California business registries.</li>
            <li>Capture citations.</li>
          </ul>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">
            Submit Findings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the registered office address"
              className="bg-slate-700 border-slate-600"
            />

            <Textarea
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="Optional: note any supporting sources"
              className="bg-slate-700 border-slate-600"
            />

            {message && (
              <div
                className={`p-4 ${message.type === "success" ? "text-green-300" : "text-red-300"}`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit">Verify Address</Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>

          {flagVisible && (
            <div className="mt-6">
              <code>{FLAG_VALUE}</code>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function CorporateFootprintLab() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <CorporateFootprintLabContent />
    </Suspense>
  );
}
