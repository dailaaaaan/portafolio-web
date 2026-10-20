import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  // Nulo para las opiniones del guestbook publico (no se les pide un "cargo");
  // relleno solo para los testimonios semilla ficticios.
  role: text('role'),
  relationship: text('relationship').notNull(),
  message: text('message').notNull(),
  locale: text('locale').notNull(),
  approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
  isSeed: integer('is_seed', { mode: 'boolean' }).notNull().default(false),
  // Guardado como entero (epoch unix), no como texto: asi se puede comparar
  // con >/< de forma fiable (un timestamp en texto con formato distinto al de
  // SQLite compararia mal alfabeticamente, ver rateLimits mas abajo).
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export const rateLimits = sqliteTable('rate_limits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ip: text('ip').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
});
