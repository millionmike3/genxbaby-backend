import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertDispatcherService {
  async dispatch(alert) {
    console.log('Dispatching alert:', alert.type, alert.message);

    // Optional integrations:
    // await sendEmail(alert);
    // await sendWebhook(alert);
    // await pushToQueue(alert);
  }
}
