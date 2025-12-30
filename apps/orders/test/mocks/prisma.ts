export const MockPrismaService = () => ({
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  onModuleInit: vi.fn(),
  onModuleDestroy: vi.fn(),
});
