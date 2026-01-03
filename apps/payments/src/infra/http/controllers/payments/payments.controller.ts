import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from 'apps/payments/src/domain/services/payments/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Get()
  getPayments() {
    return this.paymentService.getPayments();
  }

  @MessagePattern('orders')
  async payment(@Payload() message) {
    await this.paymentService.payment({
      amount: message.price,
      order_id: message.id,
      client_id: message.client_id,
    });
  }
}
