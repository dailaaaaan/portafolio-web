export interface SkillCategory {
  heading: string;
  items: string[];
}

export interface EducationEntry {
  institution: string;
  program: string;
  period: string;
}

export interface CvContent {
  objectiveHeading: string;
  objective: string;
  skillsHeading: string;
  skills: SkillCategory[];
  educationHeading: string;
  education: EducationEntry[];
  languagesHeading: string;
  languages: string[];
  downloadLabel: string;
  downloadHref: string;
}
