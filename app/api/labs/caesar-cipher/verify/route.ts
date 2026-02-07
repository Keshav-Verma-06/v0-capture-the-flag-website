import { NextResponse } from "next/server";

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      answer?: unknown;
    } | null;

    const answer = typeof body?.answer === "string" ? body.answer : "";

    if (!answer.trim()) {
      return NextResponse.json(
        { correct: false, message: "Answer is required." },
        { status: 400 },
      );
    }

    // Keep the solution/flag server-side so it isn't shipped to the browser.
    const expectedPlaintext = "The quick brown fox jumps over the lazy dog";
    const flag = "flag{caesar_shift3}";

    const correct = normalizeText(answer) === normalizeText(expectedPlaintext);

    return NextResponse.json({
      correct,
      message: correct
        ? "✓ Correct! You decrypted the Caesar cipher!"
        : "✗ Incorrect. Try a different shift value.",
      ...(correct ? { flag } : {}),
    });
  } catch {
    return NextResponse.json(
      { correct: false, message: "Invalid request." },
      { status: 400 },
    );
  }
}
