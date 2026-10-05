import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AlertsService } from './alerts.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private alerts: AlertsService) {}

  /**
   * Client subscribes to their ownerId alert channel
   */
  @SubscribeMessage('subscribeToAlerts')
  handleSubscription(
    @MessageBody() data: { ownerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`alerts:${data.ownerId}`);
    return { status: 'subscribed', ownerId: data.ownerId };
  }

  /**
   * Emit alert to all subscribers of ownerId
   */
  async emitAlert(ownerId: string, alert: any) {
    this.server.to(`alerts:${ownerId}`).emit('fraudAlert', alert);
  }
}
