// genxbaby-backend/src/routes/files.routes.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /files/:fileId
 * Returns metadata + download URL for a file
 */
router.get("/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      fileId,
      fileName: file.fileName,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: file.uploadedAt,
      downloadUrl: `/files/${fileId}/download`,
      streamUrl: `/files/${fileId}/stream`,
    });
  } catch (err) {
    console.error("File Metadata Error:", err);
    res.status(500).json({ error: "Failed to load file metadata" });
  }
});

/**
 * GET /files/:fileId/download
 * Downloads the physical file
 */
router.get("/:fileId/download", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.resolve(file.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Physical file missing" });
    }

    res.download(filePath, file.fileName);
  } catch (err) {
    console.error("File Download Error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
});

/**
 * GET /files/:fileId/stream
 * Streams the file (useful for PDFs, images, OCR preview)
 */
router.get("/:fileId/stream", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.resolve(file.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Physical file missing" });
    }

    const stream = fs.createReadStream(filePath);
    res.setHeader("Content-Type", file.mimeType);
    stream.pipe(res);
  } catch (err) {
    console.error("File Stream Error:", err);
    res.status(500).json({ error: "Failed to stream file" });
  }
});

/**
 * DELETE /files/:fileId
 * Deletes file metadata + physical file
 */
router.delete("/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.resolve(file.filePath);

    // Delete physical file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete metadata
    await prisma.uploadedFile.delete({
      where: { id: fileId },
    });

    res.json({
      message: "File deleted successfully",
      fileId,
    });
  } catch (err) {
    console.error("File Delete Error:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
