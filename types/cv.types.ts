// types/cv.types.ts

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImage?: string; 
}
export enum LevelSkill{
  BASIC = "Básico",
  INTERMEDIATE = "Intermedio",
  ADVANCED = "Avanzado",
  EXPERT = "Experto"
}
export interface Skill{
  id: string;
  name: string;
  level: LevelSkill;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}
