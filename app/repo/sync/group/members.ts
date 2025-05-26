import {GroupMember} from "../../Group";

export interface GroupMemberSyncResponse {
    members: GroupMember[],
    deletedIds: string[],
}