import type {
  RoomInfo,
  RoomPlayer,
  RoomRemovePlayer,
  RoomMob,
  RoomRemoveMob,
  RoomItem,
} from "../connection";
import type { SliceCreator } from "./types";

export interface RoomSlice {
  room: RoomInfo | null;
  players: RoomPlayer[];
  mobs: RoomMob[];
  roomItems: RoomItem[];
  setRoom: (data: RoomInfo) => void;
  setPlayers: (data: RoomPlayer[]) => void;
  addPlayer: (data: RoomPlayer) => void;
  removePlayer: (data: RoomRemovePlayer) => void;
  setMobs: (data: RoomMob[]) => void;
  addMob: (data: RoomMob) => void;
  updateMob: (data: RoomMob) => void;
  removeMob: (data: RoomRemoveMob) => void;
  setRoomItems: (data: RoomItem[]) => void;
  resetRoom: () => void;
}

export const createRoomSlice: SliceCreator<RoomSlice> = (set) => ({
  room: null,
  players: [],
  mobs: [],
  roomItems: [],
  setRoom: (data) => set({ room: data }),
  setPlayers: (data) => set({ players: data }),
  addPlayer: (data) =>
    set((state) => ({ players: [...state.players, data] })),
  removePlayer: (data) =>
    set((state) => ({
      players: state.players.filter((p) => p.name !== data.name),
    })),
  setMobs: (data) => set({ mobs: data }),
  addMob: (data) =>
    set((state) => ({ mobs: [...state.mobs, data] })),
  updateMob: (data) =>
    set((state) => ({
      mobs: state.mobs.map((m) => (m.id === data.id ? data : m)),
    })),
  removeMob: (data) =>
    set((state) => ({
      mobs: state.mobs.filter((m) => m.id !== data.id),
    })),
  setRoomItems: (data) => set({ roomItems: data }),
  resetRoom: () => set({ room: null, players: [], mobs: [], roomItems: [] }),
});
