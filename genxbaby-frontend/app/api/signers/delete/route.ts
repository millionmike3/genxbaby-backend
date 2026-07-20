import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.formData();
  const id = body.get("id") as string;

  await prisma.signer.delete({
    where: { id }
  });

  return NextResponse.redirect("/signers");
}
