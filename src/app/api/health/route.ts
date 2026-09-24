import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config/app-config";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    app: APP_CONFIG.appName,
    mode: APP_CONFIG.mode,
    facility: APP_CONFIG.facilityName,
    phase: "Phase 1 - Baseline Scaffolding",
    timestamp: new Date().toISOString(),
  });
}
