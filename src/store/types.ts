import type { StateCreator } from "zustand";
import type { GameStore } from "./index";

export type SliceCreator<T> = StateCreator<GameStore, [], [], T>;
