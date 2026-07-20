import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }) {
  const signers = await prisma.signer.findMany({
    where: { bankProfileId: params.bankProfileId },
    orderBy: { name: "asc" }
  });

  return NextResponse.json(signers);
}
