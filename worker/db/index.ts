/// <reference types="@cloudflare/workers-types" />

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function createDb(D1: D1Database) {
  return drizzle(D1, { schema });
}

export type DbInstance = ReturnType<typeof createDb>;
