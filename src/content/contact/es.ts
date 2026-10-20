import type { ContactContent } from './types';

export const es: ContactContent = {
  intro: '¿Hablamos? Puedes encontrarme en:',
  links: [
    {
      key: 'email',
      label: 'Email',
      value: 'dylanandreufiallos@gmail.com',
      href: 'mailto:dylanandreufiallos@gmail.com',
      external: false
    },
    {
      key: 'phone',
      label: 'Teléfono',
      value: '+34 617 56 55 76',
      href: 'tel:+34617565576',
      external: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/dylan-fiallos-7476742b0',
      href: 'https://www.linkedin.com/in/dylan-fiallos-7476742b0/',
      external: true
    },
    {
      key: 'github',
      label: 'GitHub',
      value: 'github.com/dailaaaaan',
      href: 'https://github.com/dailaaaaan',
      external: true
    }
  ]
};
