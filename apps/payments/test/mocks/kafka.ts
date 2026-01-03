export const MockKafkaClient = () => ({
  emit: vi.fn(),
  connect: vi.fn(),
  close: vi.fn(),
});
