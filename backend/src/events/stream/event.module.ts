import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventBus } from './event-bus.service';
import { EventProducer } from './producers/event-producer.service';
import { EventConsumer } from './consumers/event-consumer.service';
import { StreamProcessor } from './stream/stream-processor.service';
import { EventController } from './event.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    EventBus,
    EventProducer,
    EventConsumer,
    StreamProcessor,
  ],
  controllers: [EventController],
  exports: [EventBus, EventProducer],
})
export class EventModule {}
