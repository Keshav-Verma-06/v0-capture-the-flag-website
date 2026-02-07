import { NextResponse } from "next/server";

const EXPECTED_FLAG = "flag{xor_repeating_key_cracked}";
const EXPECTED_KEY = "crypto";
const CIPHERTEXT_HEX =
  "051e18170f170c002602111f06130d191a083c191c092b0c11131a1b110b1e";

function xorWithKey(value: string, key: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const keyChar = key.charCodeAt(i % key.length);
    bytes.push(value.charCodeAt(i) ^ keyChar);
  }

  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      plaintext?: unknown;
      key?: unknown;
    } | null;

    const plaintext =
      typeof body?.plaintext === "string" ? body.plaintext.trim() : "";
    const key = typeof body?.key === "string" ? body.key.trim() : "";

    if (!plaintext) {
      return NextResponse.json(
        { correct: false, message: "Plaintext is required." },
        { status: 400 },
      );
    }

    const isCorrect = plaintext === EXPECTED_FLAG;
    const keyMatches = key.toLowerCase() === EXPECTED_KEY;
    const cipherMatches = key
      ? xorWithKey(plaintext, key).toLowerCase() === CIPHERTEXT_HEX
      : false;

    if (isCorrect) {
      return NextResponse.json({
        correct: true,
        message: key
          ? keyMatches
            ? "✓ Correct plaintext and key!"
            : "✓ Correct plaintext! Key guess is close but not exact."
          : "✓ Correct plaintext recovered! Nice work.",
        flag: EXPECTED_FLAG,
      });
    }

    if (cipherMatches) {
      return NextResponse.json({
        correct: false,
        message:
          "Plaintext matches the provided key, but double-check for the proper flag format.",
      });
    }

    return NextResponse.json({
      correct: false,
      message: "✗ Incorrect plaintext. Keep analyzing the ciphertext and key.",
    });
  } catch {
    return NextResponse.json(
      { correct: false, message: "Invalid request body." },
      { status: 400 },
    );
  }
}
