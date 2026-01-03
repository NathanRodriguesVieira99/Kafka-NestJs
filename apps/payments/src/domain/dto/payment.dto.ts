import z from 'zod';

export const paymentDto = z.object({
  amount: z.number(),
  order_id: z.number(),
  client_id: z.number(),
});

export type PaymentDTO = z.infer<typeof paymentDto>;
