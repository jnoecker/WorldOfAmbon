import { create } from "zustand";
import {
  createConnectionSlice,
  type ConnectionSlice,
} from "./connectionSlice";
import {
  createCharacterSlice,
  type CharacterSlice,
} from "./characterSlice";
import { createVitalsSlice, type VitalsSlice } from "./vitalsSlice";
import { createRoomSlice, type RoomSlice } from "./roomSlice";
import {
  createInventorySlice,
  type InventorySlice,
} from "./inventorySlice";
import { createSkillsSlice, type SkillsSlice } from "./skillsSlice";
import { createChatSlice, type ChatSlice } from "./chatSlice";
import { createGroupSlice, type GroupSlice } from "./groupSlice";
import {
  createAchievementsSlice,
  type AchievementsSlice,
} from "./achievementsSlice";

export type GameStore = ConnectionSlice &
  CharacterSlice &
  VitalsSlice &
  RoomSlice &
  InventorySlice &
  SkillsSlice &
  ChatSlice &
  GroupSlice &
  AchievementsSlice;

export const useGameStore = create<GameStore>()((...a) => ({
  ...createConnectionSlice(...a),
  ...createCharacterSlice(...a),
  ...createVitalsSlice(...a),
  ...createRoomSlice(...a),
  ...createInventorySlice(...a),
  ...createSkillsSlice(...a),
  ...createChatSlice(...a),
  ...createGroupSlice(...a),
  ...createAchievementsSlice(...a),
}));
