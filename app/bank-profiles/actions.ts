"use server";

import prisma from "@/lib/prisma";

// ---------------------------------------------------------
// CREATE BANK PROFILE
// ---------------------------------------------------------
export async function createBankProfile(formData: FormData): Promise<void> {
  await prisma.bankProfile.create({
    data: {
      bankName: formData.get("bankName") as string,
      routingNumber: formData.get("routingNumber") as string,
      accountNumber: formData.get("accountNumber") as string,
      accountType: formData.get("accountType") as string,   // REQUIRED
      signerName: formData.get("signerName") as string | null,
      nextCheckNumber: Number(formData.get("nextCheckNumber")),
    },
  });
}

// ---------------------------------------------------------
// UPDATE BANK PROFILE
// ---------------------------------------------------------
export async function updateBankProfile(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;

  await prisma.bankProfile.update({
    where: { id },
    data: {
      bankName: formData.get("bankName") as string,
      routingNumber: formData.get("routingNumber") as string,
      accountNumber: formData.get("accountNumber") as string,
      accountType: formData.get("accountType") as string,   // REQUIRED
      signerName: formData.get("signerName") as string | null,
      nextCheckNumber: Number(formData.get("nextCheckNumber")),
    },
  });
}

// ---------------------------------------------------------
// UPLOAD SIGNATURE IMAGE
// ---------------------------------------------------------
export async function uploadSignature(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const file = formData.get("signature") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await prisma.bankProfile.update({
    where: { id },
    data: {
      signatureImage: dataUrl,
    },
  });
}
