// genxbaby-backend/src/routes/upload.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Store uploaded files in /uploads
const upload = multer({ dest: "uploads/" });

/**
 * POST /upload/:ownerId
 * Raw file upload → store metadata → link to owner → return file record
 */
router.post("/:ownerId", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file metadata
    const fileRecord = await prisma.uploadedFile.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      },
    });

    res.json({
      ownerId,
      file: fileRecord,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

/**
 * GET /upload/:ownerId
 * Returns all uploaded files for an owner
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const files = await prisma.uploadedFile.findMany({
      where: { ownerId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json({
      ownerId,
      files,
    });
  } catch (err) {
    console.error("Upload Fetch Error:", err);
    res.status(500).json({ error: "Failed to load uploaded files" });
  }
});

/**
 * GET /upload/file/:fileId
 * Returns metadata for a single uploaded file
 */
router.get("/file/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (err) {
    console.error("Single File Fetch Error:", err);
    res.status(500).json({ error: "Failed to load file metadata" });
  }
});

/**
 * DELETE /upload/file/:fileId
 * Deletes a file record (does NOT delete physical file)
 */
router.delete("/file/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await prisma.uploadedFile.delete({
      where: { id: fileId },
    });

    res.json({
      message: "File metadata deleted",
      fileId,
    });
  } catch (err) {
    console.error("File Delete Error:", err);
    res.status(500).json({ error: "Failed to delete file metadata" });
  }
});

module.exports = router;
