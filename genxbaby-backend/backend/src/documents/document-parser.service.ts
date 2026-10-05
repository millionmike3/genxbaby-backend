import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentParserService {
  extractFields(text: string) {
    const fields: any = {};

    // Name
    const nameMatch = text.match(/Name[:\s]+([A-Za-z\s]+)/i);
    if (nameMatch) fields.name = nameMatch[1].trim();

    // Employer
    const employerMatch = text.match(/Employer[:\s]+(.+)/i);
    if (employerMatch) fields.employer = employerMatch[1].trim();

    // Address
    const addressMatch = text.match(/Address[:\s]+(.+)/i);
    if (addressMatch) fields.address = addressMatch[1].trim();

    // Routing Number
    const routingMatch = text.match(/Routing\s*Number[:\s]+(\d{9})/i);
    if (routingMatch) fields.routingNumber = routingMatch[1];

    return fields;
  }
}
