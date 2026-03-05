import type { Achievement, AchievementProgress, CharAchievements } from "../connection";
import type { SliceCreator } from "./types";

export interface AchievementsSlice {
  completedAchievements: Achievement[];
  achievementsInProgress: AchievementProgress[];
  setAchievements: (data: CharAchievements) => void;
}

export const createAchievementsSlice: SliceCreator<AchievementsSlice> = (set) => ({
  completedAchievements: [],
  achievementsInProgress: [],
  setAchievements: (data) =>
    set({
      completedAchievements: data.completed,
      achievementsInProgress: data.inProgress,
    }),
});
