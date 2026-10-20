export interface ContactLink {
  key: string;
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export interface ContactContent {
  intro: string;
  links: ContactLink[];
}
