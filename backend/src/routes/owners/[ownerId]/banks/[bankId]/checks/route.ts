import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermissionRoute } from "@/lib/rbacRoute";

export const GET = requirePermissionRoute("check.issue", async (_req, { params }) => {
  const checks = await prisma.check.findMany({
    where: { bankProfileId: params.bankId },
  });
  return NextResponse.json(checks);
});

export const POST = requirePermissionRoute("check.issue", async (req, { params }) => {
  const body = await req.json();
  const check = await prisma.check.create({
    data: {
      bankProfileId: params.bankId,
      signerId: body.signerId,
      checkNumber: body.checkNumber,
      payee: body.payee,
      amount: body.amount,
      memo: body.memo ?? null,
      date: new Date(body.date),
    },
  });
  return NextResponse.json(check, { status: 201 });
});
