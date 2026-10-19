import type { CvContent } from './types';

export const ca: CvContent = {
  objectiveHeading: 'Objectiu professional',
  objective:
    "Desenvolupador Full Stack júnior i tècnic de suport IT amb experiència pràctica en desenvolupament web, suport de sistemes i integració d'eines d'IA. Vull aportar valor a un equip innovador mentre continuo creixent professionalment en qualsevol àmbit d'IT, ja sigui Helpdesk/Suport tècnic, Intel·ligència Artificial, Serveis IT o Desenvolupament de Software. Molt adaptable, proactiu i motivat per adoptar noves tecnologies i reptes.",
  skillsHeading: 'Habilitats',
  skills: [
    {
      heading: 'Desenvolupament Web',
      items: [
        'HTML5, CSS3, SASS, C#',
        'JavaScript, Node.js i TypeScript',
        'PHP i Laravel',
        'React.js, Next.js, Angular',
        'Desenvolupament en WordPress',
        'Temes i plugins personalitzats',
        'REST APIs',
        'Desenvolupament Frontend i Backend'
      ]
    },
    {
      heading: 'Suport IT i Sistemes',
      items: [
        'Windows i Linux (Ubuntu)',
        'Resolució de problemes de maquinari i programari',
        "Suport tècnic i resolució d'incidències",
        'Suport remot i consoles remotes',
        'Xarxes bàsiques (LAN, Wi-Fi, TCP/IP, DNS, DHCP)',
        'Atenció a usuaris i assistència tècnica',
        'Infraestructura de sistemes i web'
      ]
    },
    {
      heading: 'IA i Automatització',
      items: [
        'Desenvolupament assistit per IA',
        "Integració d'IA en projectes web",
        "Eines d'IA i LLMs",
        'Automatització de fluxos de treball',
        'Optimització de processos',
        'Automatització de tasques',
        'Solucions impulsades per IA'
      ]
    }
  ],
  educationHeading: 'Educació',
  education: [
    {
      institution: 'ETP Xavier',
      program: "Tècnic Superior en Desenvolupament d'Aplicacions Web",
      period: '2023 - 2026'
    },
    {
      institution: 'South American English Center',
      program: "Certificació d'anglès B2",
      period: '2018 - 2021'
    }
  ],
  languagesHeading: 'Idiomes',
  languages: ['Espanyol (Natiu)', 'Anglès (Avançat)', 'Català (Natiu)'],
  downloadLabel: 'Descarregar CV (PDF)',
  downloadHref: '/cv/CV_DylanAndreuFiallos-EN.pdf'
};
