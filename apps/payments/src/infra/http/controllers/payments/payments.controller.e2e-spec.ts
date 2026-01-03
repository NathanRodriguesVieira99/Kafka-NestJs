import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import type { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentsModule } from 'apps/payments/src/payments.module';

describe('PaymentsController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
