import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseNotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add a note to a case within an organization.
   * Enforces tenant isolation using organizationId.
   */
  async addNote(caseId: string, orgId: string, message: string) {
    // Ensure the case belongs to this organization
    const caseExists = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId: orgId },
    });

    if (!caseExists) {
      throw new Error('Case not found in this organization');
    }

    // Create the note
    return this.prisma.caseNote.create({
      data: {
        caseId,
        message,
      },
    });
  }

  /**
   * Optional: list notes for a case (tenant-aware)
   */
  async listNotes(caseId: string, orgId: string) {
    const caseExists = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId: orgId },
    });

    if (!caseExists) {
      throw new Error('Case not found in this organization');
    }

    return this.prisma.caseNote.findMany({
      where: { caseId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
