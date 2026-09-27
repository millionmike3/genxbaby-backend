import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertDispatcherService {
  async dispatch(alert: any) {
    // TODO: send to queue, log, etc.
  }
}
