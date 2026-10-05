export class CreateBankProfileDto {
  ownerId: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  signerName?: string;
  signatureImage?: string;
}
