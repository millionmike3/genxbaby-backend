import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.formData();

  await prisma.bankProfile.update({
    where: { id: body.get("id") as string },
    data: {
      bankName: body.get("bankName") as string,
      routingNumber: body.get("routingNumber") as string,
      accountNumber: body.get("accountNumber") as string,
      accountType: body.get("accountType") as string,
      nextCheckNumber: Number(body.get("nextCheckNumber"))
    }
  });

  return NextResponse.redirect("/bank-profiles");
}
