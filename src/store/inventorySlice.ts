import type { CharItemsList, CharItemsAdd, CharItemsRemove, Item } from "../connection";
import type { SliceCreator } from "./types";

export interface InventorySlice {
  inventory: Item[];
  equipment: Record<string, Item | null>;
  setItemsList: (data: CharItemsList) => void;
  addItem: (data: CharItemsAdd) => void;
  removeItem: (data: CharItemsRemove) => void;
}

export const createInventorySlice: SliceCreator<InventorySlice> = (set) => ({
  inventory: [],
  equipment: {},
  setItemsList: (data) =>
    set({ inventory: data.inventory, equipment: data.equipment }),
  addItem: (data) =>
    set((state) => ({ inventory: [...state.inventory, data] })),
  removeItem: (data) =>
    set((state) => ({
      inventory: state.inventory.filter((i) => i.id !== data.id),
    })),
});
