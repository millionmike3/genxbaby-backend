import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const nonce = crypto.randomBytes(16).toString("hex");

  return NextResponse.json({
    nonce,
    message: `GenxBaby Admin Login\nNonce: ${nonce}`,
  });
}
