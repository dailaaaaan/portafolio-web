import type { APIRoute } from 'astro';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../../lib/db/client.ts';
import { testimonials, rateLimits } from '../../lib/db/schema.ts';

// Este endpoint es el mismo para los 3 idiomas (no se duplica por locale),
// el locale de cada opinion viaja en el cuerpo de la peticion.
export const prerender = false;

const MAX_NAME_LENGTH = 80;
const MAX_RELATIONSHIP_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const VALID_LOCALES = new Set(['es', 'ca', 'en']);

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  if (typeof body !== 'object' || body === null) {
    return json({ error: 'invalid_body' }, 400);
  }

  const { name, relationship, message, locale, website } = body as Record<string, unknown>;

  // Honeypot: un bot que rellena este campo oculto recibe un falso "exito"
  // en vez de un error, para no darle pistas de que fue detectado.
  if (typeof website === 'string' && website.trim() !== '') {
    return json({ ok: true }, 201);
  }

  if (
    typeof name !== 'string' ||
    typeof relationship !== 'string' ||
    typeof message !== 'string' ||
    typeof locale !== 'string'
  ) {
    return json({ error: 'invalid_fields' }, 400);
  }

  const trimmedName = name.trim();
  const trimmedRelationship = relationship.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedRelationship || !trimmedMessage) {
    return json({ error: 'missing_fields' }, 400);
  }

  if (
    trimmedName.length > MAX_NAME_LENGTH ||
    trimmedRelationship.length > MAX_RELATIONSHIP_LENGTH ||
    trimmedMessage.length > MAX_MESSAGE_LENGTH
  ) {
    return json({ error: 'too_long' }, 400);
  }

  if (!VALID_LOCALES.has(locale)) {
    return json({ error: 'invalid_locale' }, 400);
  }

  const ip = clientAddress || 'unknown';
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000);

  const recentSubmissions = await db
    .select({ id: rateLimits.id })
    .from(rateLimits)
    .where(and(eq(rateLimits.ip, ip), gt(rateLimits.createdAt, windowStart)))
    .limit(1);

  if (recentSubmissions.length > 0) {
    return json({ error: 'rate_limited' }, 429);
  }

  await db.insert(rateLimits).values({ ip });

  await db.insert(testimonials).values({
    name: trimmedName,
    role: null,
    relationship: trimmedRelationship,
    message: trimmedMessage,
    locale,
    approved: false,
    isSeed: false
  });

  return json({ ok: true }, 201);
};
