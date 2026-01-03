import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/payments/src/infra/database/prisma.service';
import type { PaymentDTO } from '../../dto/payment.dto';
import type { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentStatus } from 'apps/payments/src/infra/database/generated/enums';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAYMENTS_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  getPayments() {
    return this.prisma.payment.findMany();
  }

  async payment(data: PaymentDTO) {
    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        status: PaymentStatus.APPROVED,
      },
    });

    await lastValueFrom(this.kafkaClient.emit('payments', payment));

    return payment;
  }
}
