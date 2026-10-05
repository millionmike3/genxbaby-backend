export class UploadDocumentDto {
  ownerId: string;        // Which owner the document belongs to
  fileName: string;       // Original filename
  filePath: string;       // Local or cloud path to the uploaded file
  mimeType: string;       // e.g., application/pdf, image/png
}
