import z from 'zod';

export const orderDTO = z.object({
  client_id: z.number(),
  price: z.number(),
});

export type OrderDTO = z.infer<typeof orderDTO>;
