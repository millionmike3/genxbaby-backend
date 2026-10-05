"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signer = exports.provider = exports.contract = void 0;
const ethers_1 = require("ethers");
const underwriting_abi_json_1 = __importDefault(require("./underwriting.abi.json"));
// Required environment variables
const RPC_URL = process.env.POLYGON_RPC_URL;
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.UNDERWRITING_CONTRACT_ADDRESS;
// Validate environment variables
if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error("Missing blockchain environment variables: POLYGON_RPC_URL, POLYGON_PRIVATE_KEY, UNDERWRITING_CONTRACT_ADDRESS");
}
// Provider + signer
const provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
exports.provider = provider;
const signer = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
exports.signer = signer;
// Contract instance
exports.contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, underwriting_abi_json_1.default, signer);
