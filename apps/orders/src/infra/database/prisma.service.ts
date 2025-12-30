import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/client';
import { env } from '../../env';

const CONNECTION_LIMIT = 5;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaMariaDb({
      host: env.MARIADB_HOST,
      user: env.MARIADB_USER,
      password: env.MARIADB_PASSWORD,
      database: env.MARIADB_DATABASE,
      connectionLimit: CONNECTION_LIMIT,
    });

    super({
      adapter,
      log:
        env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log('========================');
      Logger.log('Database connection OK!');
      Logger.log('========================');
    } catch (err) {
      Logger.error(`Database connection failed ${err}`);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      Logger.log('========================');
      Logger.log('Database disconnected!');
      Logger.log('========================');
    } catch (err) {
      Logger.error(`Error disconnecting database: ${err}`);
    }
  }
}
