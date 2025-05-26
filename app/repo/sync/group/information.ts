// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../../../Util";
import {getBasicAuthHeader, GetSafeCurrentUserId} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";
import {db, updateSyncStatus} from "../../../utility/database";
import {ForbiddenError, TimeoutError} from "../../../utility/Errors";
import {GroupMemberSyncResponse} from "./members";
import {GetUserRoleRights} from "../../../utility/Roles";


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
    await storeGroupMembers(data.members, groupId);
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
    const url = BACKEND_URL + 'sync/group?groupId=' + groupId;
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

async function storeGroupInformationInDatabase(group: GroupInformationResponse) {
    const now = new Date().toISOString();
    await db.runAsync('INSERT OR REPLACE INTO groups (group_id, group_name, user_count, last_sync) VALUES (?, ?, ?, ?)', group.groupId, group.groupName, group.userCount, now);
}

async function storeGroupMembers(membersSync: GroupMemberSyncResponse, groupId: string) {
    const members = membersSync.members;
    await db.withTransactionAsync(async () => {
        for (const member of members) {
            await db.runAsync(`
                INSERT OR REPLACE INTO users (user_id, username, profile_picture, last_sync)
                VALUES (?, ?, ?, ?)
            `, member.userId, member.username, member.profilePicture ?? '', new Date().toISOString());
            //TODO: add user_groups sync too
            await db.runAsync(`
                DELETE FROM user_group_roles
                WHERE user_id = ? AND group_id = ?
            `, member.userId, groupId);

            for (const role of member.userRoles) {
                await db.runAsync(`
                    INSERT OR REPLACE INTO user_group_roles (role, user_id, group_id)
                    VALUES (?, ?, ?)
                `, role, member.userId, groupId);
            }
        }
    });
}