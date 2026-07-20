import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const data = await req.json();

  const hash = crypto
    .createHash("sha256")
    .update(
      [
        data.bankName,
        data.bankAddress,
        data.payee,
        data.amount,
        data.date,
        data.checkNumber,
        data.routingNumber,
        data.accountNumber,
      ].join("|")
    )
    .digest("hex");

  const check = await prisma.check.create({
    data: {
      ...data,
      amount: parseFloat(data.amount),
      status: "active",
      hash,
    },
  });

  return NextResponse.json({ check });
}
