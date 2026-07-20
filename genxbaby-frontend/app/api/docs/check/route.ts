import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertifiedCheckPdf } from "@/lib/pdf/check";

export async function POST(req: Request) {
  const { profileId, payee, amount, memo } = await req.json();

  // 1. Atomically increment the check number
 const updatedProfile = await prisma.bankProfile.update({
  where: { id: profileId }, // <-- STRING, not Number()
  data: { nextCheckNumber: { increment: 1 } },
});

  // 2. The check number used in the PDF is the *previous* one
  const checkNumber = updatedProfile.nextCheckNumber - 1;

  // 3. Generate PDF with the correct check number
  const pdf = await generateCertifiedCheckPdf({
    profile: { ...updatedProfile, nextCheckNumber: checkNumber },
    payee,
    amount,
    memo,
  });
await prisma.check.create({
  data: {
    checkNumber,
    payee,
    amount,
    memo,
    bankProfileId: updatedProfile.id,
    date: new Date().toISOString(),
// ← REQUIRED FIELD
  },
});

}
