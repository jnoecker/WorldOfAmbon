// GMCP wire envelope
export interface GmcpEnvelope {
  gmcp: string;
  data?: unknown;
}

// --- Package payloads (Server → Client) ---

export interface CharName {
  name: string;
  race: string;
  class: string;
  level: number;
}

export interface CharVitals {
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
}

export interface CharStatusVars {
  hp: string;
  maxHp: string;
  mana: string;
  maxMana: string;
  level: string;
  xp: string;
}

export interface Item {
  id: string;
  name: string;
  slot: string | null;
  damage: number;
  armor: number;
}

export interface CharItemsList {
  inventory: Item[];
  equipment: Record<string, Item | null>;
}

export type CharItemsAdd = Item;

export interface CharItemsRemove {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldownMs: number;
  cooldownRemainingMs: number;
  levelRequired: number;
  targetType: string;
  classRestriction: string | null;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: string;
  remainingMs: number;
  stacks: number;
}

export interface Achievement {
  id: string;
  name: string;
  title?: string | null;
}

export interface AchievementProgress {
  id: string;
  name: string;
  current: number;
  required: number;
}

export interface CharAchievements {
  completed: Achievement[];
  inProgress: AchievementProgress[];
}

export interface RoomInfo {
  id: string;
  title: string;
  description: string;
  zone: string;
  exits: Record<string, string>;
}

export interface RoomPlayer {
  name: string;
  level: number;
}

export interface RoomRemovePlayer {
  name: string;
}

export interface RoomMob {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
}

export interface RoomRemoveMob {
  id: string;
}

export interface RoomItem {
  id: string;
  name: string;
}

export interface CommChannel {
  channel: string;
  sender: string;
  message: string;
}

export interface GroupMember {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  class: string;
}

export interface GroupInfo {
  leader: string | null;
  members: GroupMember[];
}

export type CorePing = Record<string, never>;

// --- Discriminated package map ---

export interface GmcpPackageMap {
  "Core.Ping": CorePing;
  "Char.Name": CharName;
  "Char.Vitals": CharVitals;
  "Char.StatusVars": CharStatusVars;
  "Char.Items.List": CharItemsList;
  "Char.Items.Add": CharItemsAdd;
  "Char.Items.Remove": CharItemsRemove;
  "Char.Skills": Skill[];
  "Char.StatusEffects": StatusEffect[];
  "Char.Achievements": CharAchievements;
  "Room.Info": RoomInfo;
  "Room.Players": RoomPlayer[];
  "Room.AddPlayer": RoomPlayer;
  "Room.RemovePlayer": RoomRemovePlayer;
  "Room.Mobs": RoomMob[];
  "Room.AddMob": RoomMob;
  "Room.UpdateMob": RoomMob;
  "Room.RemoveMob": RoomRemoveMob;
  "Room.Items": RoomItem[];
  "Comm.Channel": CommChannel;
  "Group.Info": GroupInfo;
}
