import type { CharName, CharStatusVars } from "../connection";
import type { SliceCreator } from "./types";

export interface CharacterSlice {
  name: string | null;
  race: string | null;
  class_: string | null;
  characterLevel: number;
  statusVars: CharStatusVars | null;
  setCharName: (data: CharName) => void;
  setStatusVars: (data: CharStatusVars) => void;
}

export const createCharacterSlice: SliceCreator<CharacterSlice> = (set) => ({
  name: null,
  race: null,
  class_: null,
  characterLevel: 0,
  statusVars: null,
  setCharName: (data) =>
    set({
      name: data.name,
      race: data.race,
      class_: data.class,
      characterLevel: data.level,
    }),
  setStatusVars: (data) => set({ statusVars: data }),
});
