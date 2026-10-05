import crypto from "crypto";

let chain = [];

function hashBlock(block) {
  return crypto.createHash("sha256").update(JSON.stringify(block)).digest("hex");
}

export function appendBlock({ underwritingCaseId, merkleRoot, timestamp }) {
  const previousHash = chain.length > 0 ? chain[chain.length - 1].hash : "GENESIS";

  const block = {
    index: chain.length,
    underwritingCaseId,
    merkleRoot,
    timestamp,
    previousHash,
  };

  block.hash = hashBlock(block);

  chain.push(block);
  return block;
}

export function getChainState() {
  return chain;
}
