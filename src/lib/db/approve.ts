import { eq } from 'drizzle-orm';
import { db } from './client.ts';
import { testimonials } from './schema.ts';

const id = Number(process.argv[2]);

if (!id || Number.isNaN(id)) {
  console.error('Uso: npm run db:approve -- <id>');
  process.exit(1);
}

async function approve() {
  const result = await db
    .update(testimonials)
    .set({ approved: true })
    .where(eq(testimonials.id, id))
    .returning();

  if (result.length === 0) {
    console.error(`No existe ningun testimonio con id ${id}.`);
    process.exit(1);
  }

  console.log(`Testimonio ${id} aprobado:`, result[0]);
}

approve().then(() => process.exit(0));
