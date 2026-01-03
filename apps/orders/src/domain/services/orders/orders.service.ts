import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../../../infra/database/prisma.service';
import type { OrderDTO } from '../../dto/orders.dto';
import { OrderStatus } from 'apps/orders/src/infra/database/generated/enums'; // tipagem do propio Prisma

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDERS_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async getOrders() {
    return this.prisma.order.findMany();
  }

  async createOrder(data: OrderDTO) {
    const order = await this.prisma.order.create({
      data: { ...data, status: OrderStatus.PENDING },
    });

    await lastValueFrom(this.kafkaClient.emit('orders', order));

    return order;
  }

  complete(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
