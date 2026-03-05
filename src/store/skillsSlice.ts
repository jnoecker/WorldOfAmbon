import type { Skill, StatusEffect } from "../connection";
import type { SliceCreator } from "./types";

export interface SkillsSlice {
  skills: Skill[];
  statusEffects: StatusEffect[];
  setSkills: (data: Skill[]) => void;
  setStatusEffects: (data: StatusEffect[]) => void;
}

export const createSkillsSlice: SliceCreator<SkillsSlice> = (set) => ({
  skills: [],
  statusEffects: [],
  setSkills: (data) => set({ skills: data }),
  setStatusEffects: (data) => set({ statusEffects: data }),
});
