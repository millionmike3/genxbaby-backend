import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MerkleTree } from './audit.merkle';
import { AuditService } from './audit.service';
import { ethers } from 'ethers';

@Injectable()
export class AuditAnchorService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async anchor(ownerId: string) {
    const logs = await this.audit.getAll(ownerId);

    const leaves = logs.map(log =>
      JSON.stringify({
        action: log.action,
        userId: log.userId,
        meta: log.meta,
        timestamp: log.timestamp,
      }),
    );

    const tree = new MerkleTree(leaves);
    const root = tree.build();

    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      process.env.AUDIT_ANCHOR_CONTRACT,
      ['function anchor(bytes32 root) public'],
      wallet,
    );

    const tx = await contract.anchor(root);
    const receipt = await tx.wait();

    return this.prisma.auditAnchor.create({
      data: {
        ownerId,
        root,
        txHash: receipt.hash,
        timestamp: new Date(),
      },
    });
  }

  async verify(ownerId: string) {
    const logs = await this.audit.getAll(ownerId);
    const leaves = logs.map(log =>
      JSON.stringify({
        action: log.action,
        userId: log.userId,
        meta: log.meta,
        timestamp: log.timestamp,
      }),
    );

    const tree = new MerkleTree(leaves);
    const root = tree.build();

    const anchor = await this.prisma.auditAnchor.findFirst({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
    });

    return {
      anchoredRoot: anchor.root,
      currentRoot: root,
      match: anchor.root === root,
      txHash: anchor.txHash,
    };
  }
}
