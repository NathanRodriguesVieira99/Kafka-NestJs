import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  await app.listen(env.PORT);
}
bootstrap();
