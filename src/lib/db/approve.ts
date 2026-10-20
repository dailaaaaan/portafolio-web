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
    db.$client.close();
    process.exitCode = 1;
    return;
  }

  console.log(`Testimonio ${id} aprobado:`, result[0]);
}

// No se llama a process.exit(): con Turso (HTTP/WS) cerrar la conexion es
// async a nivel de libuv, y forzar la salida justo despues provoca un
// "Assertion failed" en Windows. Se deja que Node termine solo una vez que
// close() libera el handle y no queda nada mas pendiente en el event loop.
approve().then(() => {
  db.$client.close();
});
