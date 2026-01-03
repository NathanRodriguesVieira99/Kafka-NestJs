import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { MockPrismaService } from 'apps/orders/test/mocks/prisma';
import { MockKafkaClient } from 'apps/orders/test/mocks/kafka';
import { PrismaService } from 'apps/payments/src/infra/database/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  const mockPrismaService = MockPrismaService();
  const mockKafkaClient = MockKafkaClient();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: 'PAYMENTS_SERVICE',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
