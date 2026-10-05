"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBorrower = createBorrower;
exports.getBorrowerById = getBorrowerById;
exports.createProperty = createProperty;
exports.getPropertyById = getPropertyById;
exports.createMortgage = createMortgage;
exports.getMortgageById = getMortgageById;
exports.createUnderwritingCase = createUnderwritingCase;
exports.getUnderwritingCase = getUnderwritingCase;
exports.listUnderwritingCases = listUnderwritingCases;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* -------------------------------------------------------
 * BORROWER
 * -----------------------------------------------------*/
async function createBorrower(data) {
    return prisma.borrower.create({ data });
}
async function getBorrowerById(id) {
    return prisma.borrower.findUnique({
        where: { id: Number(id) }
    });
}
/* -------------------------------------------------------
 * PROPERTY
 * -----------------------------------------------------*/
async function createProperty(data) {
    return prisma.property.create({ data });
}
async function getPropertyById(id) {
    return prisma.property.findUnique({
        where: { id: Number(id) }
    });
}
/* -------------------------------------------------------
 * MORTGAGE (Option A)
 * -----------------------------------------------------*/
async function createMortgage(data) {
    return prisma.mortgage.create({ data });
}
async function getMortgageById(id) {
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
async function createUnderwritingCase(data) {
    return prisma.underwritingCase.create({ data });
}
async function getUnderwritingCase(id) {
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
async function listUnderwritingCases() {
    return prisma.underwritingCase.findMany({
    // add options if needed, or leave empty
    });
}
