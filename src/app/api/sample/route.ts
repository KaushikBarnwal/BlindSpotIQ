import { NextResponse } from "next/server";
import { SAMPLE_SCHOLARSHIP_SCENARIO, SAMPLE_VISA_SCENARIO } from "@/lib/sampleData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "visa") {
    return NextResponse.json(SAMPLE_VISA_SCENARIO);
  }

  // Default to scholarship scenario
  return NextResponse.json(SAMPLE_SCHOLARSHIP_SCENARIO);
}

