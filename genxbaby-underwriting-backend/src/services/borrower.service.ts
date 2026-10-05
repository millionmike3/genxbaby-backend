import { prisma } from '../db/client'

export const borrowerService = {
  async create(data: any) {
    return prisma.borrower.create({ data })
  },
}
