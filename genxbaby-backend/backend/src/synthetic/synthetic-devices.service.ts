import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticDevicesService {
  detect(owner, deviceClusters) {
    const signals = [];

    if (deviceClusters.length >= 2) {
      signals.push('DEVICE_SHARED_CLUSTER');
    }

    if (owner.devices.length === 0) {
      signals.push('NO_DEVICE_HISTORY');
    }

    return signals;
  }
}
