import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from '../event-bus.service';

@Injectable()
export class StreamProcessor implements OnModuleInit {
  constructor(private bus: EventBus) {}

  onModuleInit() {
    this.bus.subscribe('CHECK_PROCESSED', async (event) => {
      const { ownerId, payload } = event;

      // Velocity rule: too many checks in 24 hours
      if (payload.checkCount24h >= 5) {
        this.bus.publish({
          type: 'VELOCITY_ALERT',
          ownerId,
          payload: {
            message: 'High check velocity detected',
            count: payload.checkCount24h,
          },
        });
      }
    });
  }
}
