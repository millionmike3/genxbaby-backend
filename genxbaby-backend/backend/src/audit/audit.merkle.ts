import * as crypto from 'crypto';

export class MerkleTree {
  leaves: string[];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(l => this.hash(l));
  }

  hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  build() {
    let level = this.leaves;

    while (level.length > 1) {
      const next: string[] = [];

      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || left;
        next.push(this.hash(left + right));
      }

      level = next;
    }

    return level[0];
  }
}
