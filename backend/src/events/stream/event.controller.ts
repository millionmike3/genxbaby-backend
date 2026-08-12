import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventBus } from './event-bus.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('events')
export class EventController {
  constructor(
    private bus: EventBus,
    private prisma: PrismaService,
  ) {}

  @Post()
  async publish(@Body() body) {
    return this.bus.publish(body);
  }

  @Get()
  async list() {
    return this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}

