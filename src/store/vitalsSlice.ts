import type { CharVitals } from "../connection";
import type { SliceCreator } from "./types";

export interface VitalsSlice {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpToNextLevel: number | null;
  gold: number;
  inCombat: boolean;
  setVitals: (data: CharVitals) => void;
  resetVitals: () => void;
}

export const createVitalsSlice: SliceCreator<VitalsSlice> = (set) => ({
  hp: 0,
  maxHp: 0,
  mana: 0,
  maxMana: 0,
  level: 0,
  xp: 0,
  xpIntoLevel: 0,
  xpToNextLevel: null,
  gold: 0,
  inCombat: false,
  setVitals: (data) =>
    set({
      hp: data.hp,
      maxHp: data.maxHp,
      mana: data.mana,
      maxMana: data.maxMana,
      level: data.level,
      xp: data.xp,
      xpIntoLevel: data.xpIntoLevel,
      xpToNextLevel: data.xpToNextLevel,
      gold: data.gold,
      inCombat: data.inCombat,
    }),
  resetVitals: () =>
    set({ hp: 0, maxHp: 0, mana: 0, maxMana: 0, level: 0, xp: 0, xpIntoLevel: 0, xpToNextLevel: null, gold: 0, inCombat: false }),
});
