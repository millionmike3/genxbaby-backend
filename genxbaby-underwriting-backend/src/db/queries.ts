import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* -------------------------------------------------------
 * BORROWER
 * -----------------------------------------------------*/
export async function createBorrower(data: any) {
  return prisma.borrower.create({ data });
}

export async function getBorrowerById(id: number | string) {
  return prisma.borrower.findUnique({
    where: { id: Number(id) }
  });
}

/* -------------------------------------------------------
 * PROPERTY
 * -----------------------------------------------------*/
export async function createProperty(data: any) {
  return prisma.property.create({ data });
}

export async function getPropertyById(id: number | string) {
  return prisma.property.findUnique({
    where: { id: Number(id) }
  });
}

/* -------------------------------------------------------
 * MORTGAGE (Option A)
 * -----------------------------------------------------*/
export async function createMortgage(data: any) {
  return prisma.mortgage.create({ data });
}

export async function getMortgageById(id: number | string) {
  return prisma.mortgage.findUnique({
    where: { id: Number(id) },
    include: {
      borrower: true,
      property: true
    }
  });
}

/* -------------------------------------------------------
 * UNDERWRITING CASE (Option A)
 * -----------------------------------------------------*/
export async function createUnderwritingCase(data: any) {
  return prisma.underwritingCase.create({ data });
}

export async function getUnderwritingCase(id: number | string) {
  return prisma.underwritingCase.findUnique({
    where: { id: Number(id) },
    include: {
      borrower: true,
      mortgage: {
        include: {
          property: true
        }
      }
    }
  });
}

export async function listUnderwritingCases() {
  return prisma.underwritingCase.findMany({
    // add options if needed, or leave empty
  });
}
