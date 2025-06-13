export const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"];
export type Gender = typeof GENDER_OPTIONS[number];

export const GENDER_MAPPING: Record<Gender, number> = {
  "Female": 1,
  "Male": 2,
  "Prefer not to say": 3,
};