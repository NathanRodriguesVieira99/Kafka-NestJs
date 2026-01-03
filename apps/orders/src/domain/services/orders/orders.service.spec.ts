import { MockKafkaClient } from '../../../../test/mocks/kafka';
import { MockPrismaService } from '../../../../test/mocks/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../../../infra/database/prisma.service';
import { of } from 'rxjs';

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

  it('should get orders', async () => {
    const orders = [
      { client_id: Math.random(), price: 100 },
      { client_id: Math.random(), price: 100 },
    ];

    mockPrismaService.order.findMany.mockResolvedValue(orders);

    const res = await service.getOrders();

    expect(res).toEqual(orders);
  });

  it('should create a order and publish to Kafka', async () => {
    const createOrderData = {
      id: Math.random(),
      client_id: Math.random(),
      price: 100,
      created_at: Date.now(),
      status: 'PENDING',
    };

    mockPrismaService.order.create.mockResolvedValue(createOrderData);

    mockKafkaClient.emit.mockReturnValue(of(true));

    const res = await service.createOrder(createOrderData);

    expect(res).toEqual(createOrderData);

    expect(mockPrismaService.order.create).toHaveBeenCalledWith({
      data: { ...createOrderData, status: 'PENDING' },
    });

    expect(mockKafkaClient.emit).toHaveBeenCalledTimes(1);

    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'orders',
      createOrderData,
    );
  });
});
