import type { GroupInfo, GroupMember } from "../connection";
import type { SliceCreator } from "./types";

export interface GroupSlice {
  groupLeader: string | null;
  groupMembers: GroupMember[];
  setGroupInfo: (data: GroupInfo) => void;
}

export const createGroupSlice: SliceCreator<GroupSlice> = (set) => ({
  groupLeader: null,
  groupMembers: [],
  setGroupInfo: (data) =>
    set({ groupLeader: data.leader, groupMembers: data.members }),
});
