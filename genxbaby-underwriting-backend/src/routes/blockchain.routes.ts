import { Router } from "express";
import { verifyAnchor } from "../controllers/blockchain.controller";

const router = Router();

router.get("/verify/:txHash", verifyAnchor);

export default router;
