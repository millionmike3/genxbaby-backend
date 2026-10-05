import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticSignalsService {
  extract(owner) {
    const signals = [];

    // Signal 1 — Thin identity (no documents, no devices)
    if (owner.documents.length === 0 && owner.devices.length === 0) {
      signals.push('THIN_IDENTITY');
    }

    // Signal 2 — Multiple addresses
    if (owner.addressHistory && owner.addressHistory.length >= 3) {
      signals.push('MULTIPLE_ADDRESSES');
    }

    // Signal 3 — Multiple phone numbers
    if (owner.phoneHistory && owner.phoneHistory.length >= 3) {
      signals.push('MULTIPLE_PHONES');
    }

    // Signal 4 — No DOB or invalid DOB
    if (!owner.dob) {
      signals.push('MISSING_DOB');
    }

    // Signal 5 — No SSN or invalid SSN format
    if (!owner.ssn || owner.ssn.length !== 9) {
      signals.push('INVALID_SSN');
    }

    return signals;
  }
}
