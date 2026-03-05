import type { ConnectionState } from "../connection";
import { GmcpDispatcher } from "../connection";
import { WebSocketManager } from "../connection";
import type { SliceCreator } from "./types";

export interface ConnectionSlice {
  connectionState: ConnectionState;
  connect: (url: string) => void;
  disconnect: () => void;
  send: (text: string) => void;
  sendGmcp: (pkg: string, data?: unknown) => void;
  resetGameState: () => void;
}

let manager: WebSocketManager | null = null;

export const createConnectionSlice: SliceCreator<ConnectionSlice> = (
  set,
  get,
) => ({
  connectionState: "disconnected",

  connect: (url) => {
    if (manager) return;

    const dispatcher = new GmcpDispatcher();

    // Character
    dispatcher.on("Char.Name", (data) => get().setCharName(data));
    dispatcher.on("Char.StatusVars", (data) => get().setStatusVars(data));

    // Vitals
    dispatcher.on("Char.Vitals", (data) => get().setVitals(data));

    // Room
    dispatcher.on("Room.Info", (data) => get().setRoom(data));
    dispatcher.on("Room.Players", (data) => get().setPlayers(data));
    dispatcher.on("Room.AddPlayer", (data) => get().addPlayer(data));
    dispatcher.on("Room.RemovePlayer", (data) => get().removePlayer(data));
    dispatcher.on("Room.Mobs", (data) => get().setMobs(data));
    dispatcher.on("Room.AddMob", (data) => get().addMob(data));
    dispatcher.on("Room.UpdateMob", (data) => get().updateMob(data));
    dispatcher.on("Room.RemoveMob", (data) => get().removeMob(data));
    dispatcher.on("Room.Items", (data) => get().setRoomItems(data));

    // Inventory
    dispatcher.on("Char.Items.List", (data) => get().setItemsList(data));
    dispatcher.on("Char.Items.Add", (data) => get().addItem(data));
    dispatcher.on("Char.Items.Remove", (data) => get().removeItem(data));

    // Skills
    dispatcher.on("Char.Skills", (data) => get().setSkills(data));
    dispatcher.on("Char.StatusEffects", (data) => get().setStatusEffects(data));

    // Chat
    dispatcher.on("Comm.Channel", (data) => get().addChannelMessage(data));
    dispatcher.onText((text) => get().addTextLine(text));

    // Group
    dispatcher.on("Group.Info", (data) => get().setGroupInfo(data));

    // Achievements
    dispatcher.on("Char.Achievements", (data) => get().setAchievements(data));

    manager = new WebSocketManager({
      url,
      onGmcp: (pkg, data) => dispatcher.dispatch(pkg, data),
      onText: (text) => dispatcher.dispatchText(text),
      onStateChange: (state) => {
        set({ connectionState: state });
        if (state === "disconnected") {
          get().resetGameState();
        }
      },
    });

    manager.connect();
  },

  disconnect: () => {
    if (manager) {
      manager.disconnect();
      manager = null;
    }
    get().resetGameState();
  },

  send: (text) => {
    manager?.send(text);
  },

  sendGmcp: (pkg, data) => {
    manager?.sendGmcp(pkg, data);
  },

  resetGameState: () => {
    const s = get();
    s.resetCharacter();
    s.resetVitals();
    s.resetRoom();
    s.resetInventory();
    s.resetSkills();
    s.resetGroup();
    s.resetAchievements();
  },
});
