import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const borrower = await prisma.borrower.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      annualIncome: 85000,
      creditScore: 720,
    },
  })

  const property = await prisma.property.create({
    data: {
      address: '123 Main St',
      city: 'Queens',
      state: 'NY',
      zipcode: '11420',
      propertyType: 'Single Family',
      squareFeet: 1800,
      bedrooms: 3,
      bathrooms: 2,
      marketValue: 450000,
    },
  })

  const mortgage = await prisma.mortgage.create({
    data: {
      borrowerId: borrower.id,
      propertyId: property.id,
      loanAmount: 250000,
      status: 'PENDING',
    },
  })

  console.log({ borrower, property, mortgage })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
