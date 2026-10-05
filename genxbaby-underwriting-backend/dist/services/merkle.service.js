"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMerkleRoot = generateMerkleRoot;
const ethers_1 = require("ethers");
const buffer_1 = require("buffer");
function generateMerkleRoot(leaves) {
    const buffers = leaves.map(leaf => buffer_1.Buffer.from(leaf.replace(/^0x/, ""), "hex"));
    const concatenated = buffer_1.Buffer.concat(buffers);
    return (0, ethers_1.keccak256)(concatenated);
}
