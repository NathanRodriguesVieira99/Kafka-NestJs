// !! SUGESTÃO DA IA PARA USAR O DOTENV DESSA FORMA PARA VALIDAR O .env DESSE APP (NÃO SEI COMO USAR ISSO PARA TER ACESSO A OUTROS ENV TIPO test, e2e etc)
import { config } from 'dotenv';
import { join } from 'node:path';
config({ path: join(process.cwd(), 'apps/orders/.env') });

import { Logger } from '@nestjs/common';
import z from 'zod';

export const envSchema = z.object({
  // ========== Database ==========
  DATABASE_URL: z.url().startsWith('mysql://'),
  MARIADB_USER: z.string(),
  MARIADB_PASSWORD: z.string(),
  MARIADB_ROOT_PASSWORD: z.string(),
  MARIADB_HOST: z.string(),
  MARIADB_DATABASE: z.string(),
  MARIADB_PORT: z.coerce.number().default(3306),
  // ========== ENV ==========
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'e2e'])
    .default('development'),
  // ========== PORT ==========
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

// !! GAMBIARRA QUE A IA SUGERIU, para o ignorar o prisma na hora de validar as variáveis de ambiente, pois o prisma estava rodando os scripts com as variáveis de ambiente undefined (não sei se existe uma solução melhor)
const isPrisma = process.argv.some((arg) => arg.includes('prisma'));

if (!_env.success && !isPrisma) {
  Logger.error('❌ Invalid environment variables', 'EnvValidation');
  Logger.error(_env.error._zod);
  throw new Error('Invalid environment variables');
}

export type Env = z.infer<typeof envSchema>;

export const env = _env.success ? _env.data : ({} as Env); // !! valida para as variáveis não serem undefined
