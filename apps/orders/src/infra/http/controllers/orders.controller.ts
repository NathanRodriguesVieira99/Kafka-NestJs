import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from '../../../domain/services/orders/orders.service';
import type { OrderDTO } from 'apps/orders/src/domain/dto/orders.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderStatus } from '../../database/generated/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Post()
  createOrder(@Body() data: OrderDTO) {
    return this.ordersService.createOrder(data);
  }

  @MessagePattern('payments')
  async complete(@Payload() message) {
    return await this.ordersService.complete(
      message.order_id,
      message.status === 'APPROVED' ? OrderStatus.PAYED : OrderStatus.CANCELED,
    );
  }
}
