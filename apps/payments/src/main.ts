import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { env } from './env';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // 29092 se estiver dentro do docker
      },
      consumer: { groupId: 'payments-consumer' },
    },
  });

  await app.startAllMicroservices();

  await app.listen(env.PORT);
}
bootstrap();
