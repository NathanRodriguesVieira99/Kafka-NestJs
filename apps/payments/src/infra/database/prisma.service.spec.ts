import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { MockPrismaService } from '../../../test/mocks/prisma';

describe('PrismaService', () => {
  let service: PrismaService;
  const mockPrismaService = MockPrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(' should call $connect', async () => {
    mockPrismaService.onModuleInit.mockImplementation(() => {
      mockPrismaService.$connect();
    });

    await service.onModuleInit();

    expect(service.$connect).toHaveBeenCalledTimes(1);
  });

  it(' should call $disconnect', async () => {
    mockPrismaService.onModuleDestroy.mockImplementation(() => {
      mockPrismaService.$disconnect();
    });

    await service.onModuleDestroy();

    expect(service.$disconnect).toHaveBeenCalledTimes(1);
  });
});
