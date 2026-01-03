import { Test } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { OrdersModule } from 'apps/orders/src/orders.module';
import request from 'supertest';

describe('OrdersController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // cria o App e se conecta ao db apenas uma vez
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Fecha a conexão com o Prisma
    await app.close(); // Fecha a conexão com o App
  });

  beforeEach(async () => {
    await prisma.order.deleteMany(); // limpa o banco antes de cada teste e2e
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('[GET] /orders - should return all orders', async () => {
    const res = await request(app.getHttpServer()).get('/orders');

    expect(res.statusCode).toBe(200);
  });

  it('[POST] /orders - should create a order', async () => {
    const order = {
      client_id: Math.random(),
      price: 4000,
    };

    const res = await request(app.getHttpServer()).post('/orders').send(order);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('id');
  });
});
