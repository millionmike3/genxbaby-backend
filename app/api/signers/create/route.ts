import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.formData();

  const signer = await prisma.signer.create({
    data: {
      name: body.get("name") as string,
      title: body.get("title") as string,
      signatureImage: body.get("signatureImage") as string,
      bankProfileId: body.get("bankProfileId") as string
    }
  });

  return NextResponse.redirect("/signers");
}
