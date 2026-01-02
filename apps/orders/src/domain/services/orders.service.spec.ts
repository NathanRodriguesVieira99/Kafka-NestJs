import { MockKafkaClient } from './../../../test/mocks/kafka';
import { MockPrismaService } from './../../../test/mocks/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../infra/database/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockPrismaService = MockPrismaService(); // mock do Prisma
  const mockKafkaClient = MockKafkaClient(); // mock do Kafka

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'ORDERS_SERVICE',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
