import { NextResponse } from "next/server";
import { popularTickers } from "@/lib/server/fred";

// Refetch from FRED at most once a day; popularity rarely changes.
export const revalidate = 86400;

export async function GET() {
  try {
    return NextResponse.json(await popularTickers());
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status ?? 500 });
  }
}
