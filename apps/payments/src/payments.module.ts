import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/database/prisma.module';
import { PaymentsController } from './infra/http/controllers/payments/payments.controller';
import { PaymentsService } from './domain/services/payments/payments.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'PAYMENTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payments',
            brokers: ['localhost:9092'], // 29092 se estiver dentro do docker
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
