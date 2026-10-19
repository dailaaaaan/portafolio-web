import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.ts';

// process.env (no import.meta.env) a proposito: este mismo archivo lo importa
// tanto Astro en SSR como el script de semillas (src/lib/db/seed.ts), que se
// ejecuta con Node directamente y no pasa por Vite.
//
// En desarrollo usa un archivo SQLite local (local.db, fuera de git).
// En produccion, definir TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) apunta a la
// base de datos Turso real, sin cambiar ni una linea de este archivo.
const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(authToken ? { url, authToken } : { url });

export const db = drizzle(client, { schema });
