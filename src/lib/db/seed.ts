import { eq } from 'drizzle-orm';
import { db } from './client.ts';
import { testimonials } from './schema.ts';

type Locale = 'es' | 'ca' | 'en';

interface SeedPerson {
  name: string;
  translations: Record<Locale, { role: string; relationship: string; message: string }>;
}

// Testimonios ficticios, escritos para este portafolio (ver CLAUDE.md seccion 1
// y 7: marcados con isSeed = true, nunca presentados como reales en los datos).
const people: SeedPerson[] = [
  {
    name: 'Marc Roig',
    translations: {
      es: {
        role: 'Desarrollador Frontend',
        relationship: 'Compañero en Wallbox',
        message:
          'Trabajar con Dylan en Wallbox fue genial: siempre dispuesto a ayudar con Angular y nunca dejaba un bug sin entender la causa raíz.'
      },
      ca: {
        role: 'Desenvolupador Frontend',
        relationship: 'Company a Wallbox',
        message:
          "Treballar amb en Dylan a Wallbox va ser genial: sempre disposat a ajudar amb Angular i mai deixava un bug sense entendre'n la causa."
      },
      en: {
        role: 'Frontend Developer',
        relationship: 'Colleague at Wallbox',
        message:
          'Working with Dylan at Wallbox was great: always ready to help with Angular and never left a bug without understanding the root cause.'
      }
    }
  },
  {
    name: 'Laura Giménez',
    translations: {
      es: {
        role: 'Coordinadora de proyecto',
        relationship: 'Compañera en DevLeap',
        message:
          'Dylan aportó mucho al equipo de DevLeap: aprendió Next.js y Hygraph a toda velocidad y siempre proponía mejoras para la experiencia de usuario.'
      },
      ca: {
        role: 'Coordinadora de projecte',
        relationship: 'Companya a DevLeap',
        message:
          "En Dylan va aportar molt a l'equip de DevLeap: va aprendre Next.js i Hygraph a tota velocitat i sempre proposava millores per a l'experiència d'usuari."
      },
      en: {
        role: 'Project Coordinator',
        relationship: 'Colleague at DevLeap',
        message:
          'Dylan brought a lot to the DevLeap team: he picked up Next.js and Hygraph fast and always suggested improvements for the user experience.'
      }
    }
  },
  {
    name: 'Carla Esteve',
    translations: {
      es: {
        role: 'Responsable de proyectos',
        relationship: 'Responsable en ITnube',
        message:
          'Dylan gestionó varias webs de conferencias en WordPress sin perder ni un plazo, y los clientes siempre quedaban contentos con su soporte.'
      },
      ca: {
        role: 'Responsable de projectes',
        relationship: 'Responsable a ITnube',
        message:
          'En Dylan va gestionar diverses webs de conferències en WordPress sense perdre ni un termini, i els clients sempre quedaven contents amb el seu suport.'
      },
      en: {
        role: 'Project Manager',
        relationship: 'Manager at ITnube',
        message:
          'Dylan managed several conference websites on WordPress without missing a single deadline, and clients were always happy with his support.'
      }
    }
  },
  {
    name: 'Jordi Puig',
    translations: {
      es: {
        role: 'Voluntario técnico',
        relationship: 'Compañero en Asociación LVC',
        message:
          'Gracias a Dylan la web de la asociación carga muchísimo más rápido, y encima se tomó el tiempo de explicarnos cómo mantenerla nosotros mismos.'
      },
      ca: {
        role: 'Voluntari tècnic',
        relationship: "Company a l'Associació LVC",
        message:
          "Gràcies a en Dylan la web de l'associació carrega molt més ràpid, i a més es va prendre el temps d'explicar-nos com mantenir-la nosaltres mateixos."
      },
      en: {
        role: 'Technical Volunteer',
        relationship: 'Colleague at Asociación LVC',
        message:
          "Thanks to Dylan, the association's website loads much faster, and he even took the time to explain how we could maintain it ourselves."
      }
    }
  }
];

async function seed() {
  const rows = people.flatMap((person) =>
    (Object.entries(person.translations) as [Locale, (typeof person.translations)['es']][]).map(
      ([locale, t]) => ({
        name: person.name,
        role: t.role,
        relationship: t.relationship,
        message: t.message,
        locale,
        approved: true,
        isSeed: true
      })
    )
  );

  // Vuelve a dejar los datos semilla limpios en cada ejecucion, sin tocar las
  // opiniones reales que hayan podido llegar por el guestbook (isSeed = false).
  await db.delete(testimonials).where(eq(testimonials.isSeed, true));
  await db.insert(testimonials).values(rows);

  console.log(`Seed completado: ${rows.length} testimonios insertados.`);
}

// No se llama a process.exit(): con Turso (HTTP/WS) cerrar la conexion es
// async a nivel de libuv, y forzar la salida justo despues provoca un
// "Assertion failed" en Windows (no afecta a los datos, que ya se guardaron,
// pero conviene salir limpio). Se deja que Node termine solo una vez que
// close() libera el handle y no queda nada mas pendiente en el event loop.
seed()
  .then(() => {
    db.$client.close();
  })
  .catch((error: unknown) => {
    console.error('Error al sembrar la base de datos:', error);
    db.$client.close();
    process.exitCode = 1;
  });
