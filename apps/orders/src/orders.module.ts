import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/database/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersService } from './domain/services/orders/orders.service';
import { OrdersController } from './infra/http/controllers/orders.controller';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'orders',
            brokers: ['localhost:9092'], // 29092 se estiver dentro do docker
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
