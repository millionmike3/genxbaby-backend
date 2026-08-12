import { Router } from "express";
import pdfModern from "./pdf-modern";
import pdf from "./pdf";
import create from "./create";
import list from "./list";
import deleteCheck from "./delete";
import bulkPdf from "./bulk-pdf";
import bulkEmail from "./bulk-email";

const router = Router();

router.post("/pdf-modern", pdfModern);
router.post("/pdf", pdf);
router.post("/create", create);
router.get("/list", list);
router.post("/delete", deleteCheck);
router.post("/bulk-pdf", bulkPdf);
router.post("/bulk-email", bulkEmail);

export default router;
