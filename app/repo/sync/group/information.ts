// @ts-ignore

import {timeoutPromiseFactory} from "../../../Util";
import {getBasicAuthHeader, GetSafeCurrentUserId} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";
import {db, updateSyncStatus} from "../../../utility/database";
import {ForbiddenError, TimeoutError} from "../../../utility/Errors";
import {GetUserRoleRights} from "../../../utility/Roles";
import {groupMembersCacheKey, GroupMemberSyncResponse, handleLocalGroupMembersSync} from "./memberList";


export interface GroupInformationResponse {
    groupId: string,
    groupName: string,
    userCount: string,
    userRoles: string[],
    userRoleRights?: string[],
}



interface GroupInformationWrapper {
    groupInfo: GroupInformationResponse,
    members: GroupMemberSyncResponse,
}
export const singleGroupCacheKeySuffixId = 'groupInformation_';
export async function TrySyncGroup(groupId: string): Promise<GroupInformationResponse> {
    try {
        await SyncGroupInformation(groupId);
        await updateSyncStatus(singleGroupCacheKeySuffixId + groupId);
        await updateSyncStatus(groupMembersCacheKey + groupId);
        return await getGroupInformation(groupId);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return await getGroupInformation(groupId);
        }
        throw error;
    }
}

async function SyncGroupInformation(groupId: string) {
    const data = await GetGroupInformationFromBackend(groupId);
    await storeGroupInformationInDatabase(data.groupInfo);
    await handleLocalGroupMembersSync(data.members);
}

export async function getGroupInformation(groupId: string): Promise<GroupInformationResponse> {
    const groupInfo: {groupId: string, groupName: string, userCount: string}|null = await db.getFirstAsync(`
SELECT 
    group_id AS groupId, 
    group_name AS groupName, 
    user_count AS userCount
FROM groups 
WHERE group_id = ?`, groupId);

    if (!groupInfo) {
        throw new ForbiddenError(`Group with ID ${groupId} not found in database.`);
    }

    const userId = await GetSafeCurrentUserId()
    const rolesRes = await db.getAllAsync<{role: string}>(`SELECT role FROM user_group_roles WHERE group_id = ? AND user_id = ?`, groupId, userId);
    const userRoles = rolesRes.map(role => role.role);
    const userRoleRights = GetUserRoleRights(userRoles);
    return {
        groupId: groupInfo.groupId,
        groupName: groupInfo.groupName,
        userCount: groupInfo.userCount,
        userRoles,
        userRoleRights
    };
}

async function GetGroupInformationFromBackend(groupId: string): Promise<GroupInformationWrapper> {

    const timeoutPromise = timeoutPromiseFactory()
    const url = process.env.EXPO_PUBLIC_API_URL + 'sync/group?groupId=' + groupId;
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });
    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    const data = await res.json();
    return {
        groupInfo: data.groupInfo,
        members: {
            members: Array.isArray(data.members.members) ? data.members.members : [],
            deletedIds: Array.isArray(data.members.deletedIds) ? data.members.deletedIds : [],
        },
    };}

async function storeGroupInformationInDatabase(group: GroupInformationResponse): Promise<void> {
    const now = new Date().toISOString();
    await db.runAsync(`
    INSERT INTO groups (
      group_id, group_name, user_count, last_sync
    )
    VALUES (?, ?, ?, ?)
    ON CONFLICT(group_id) DO UPDATE SET
      group_name = excluded.group_name,
      user_count = excluded.user_count,
      last_sync = excluded.last_sync;
  `,
        group.groupId,
        group.groupName,
        group.userCount,
        now);
}
