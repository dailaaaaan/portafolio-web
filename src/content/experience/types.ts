export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ExperienceContent {
  professionalHeading: string;
  professional: ExperienceEntry[];
  outsideItHeading: string;
  outsideIt: ExperienceEntry[];
}
