import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type EventPayload = {
  type: string;
  ownerId?: string;
  payload: any;
};

@Injectable()
export class EventBus {
  private subscribers: Record<string, Function[]> = {};

  constructor(private prisma: PrismaService) {}

  async publish(event: EventPayload) {
    // Store event
    await this.prisma.event.create({
      data: {
        type: event.type,
        ownerId: event.ownerId,
        payload: event.payload,
      },
    });

    // Notify subscribers
    const subs = this.subscribers[event.type] || [];
    subs.forEach((fn) => fn(event));
  }

  subscribe(eventType: string, handler: Function) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(handler);
  }
}
