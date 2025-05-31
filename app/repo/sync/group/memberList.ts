// @ts-ignore
import {BACKEND_URL} from '@env';
import {GroupMember} from "../../Group";
import {db, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {TimeoutError} from "../../../utility/Errors";
import {getBasicAuthHeader} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";

const groupMembersCacheKey = "groupMembers_";


export interface GroupMemberSyncResponse {
    members: GroupMember[];
    deletedIds: string[];
}

export async function TrySyncGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
        await SyncMembers(groupId);
        await updateSyncStatus(groupMembersCacheKey + groupId)
        return getGroupMembers(groupId);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return getGroupMembers(groupId);
        }
        throw error;
    }
}

type GroupMemberDBRow = {
    userGroupId: string
    groupId: string
    userId: string
    username: string
    joinedAt: string
    userRolesString: string | null
    profilePicture: string | null
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const data = await db.getAllAsync<GroupMemberDBRow>(`
        SELECT ug.id                 AS userGroupId,
               ug.group_id           AS groupId,
               u.user_id             AS userId,
               u.username,
               group_concat(ur.role) AS userRolesString,
               u.profile_picture     AS profilePicture,
               ug.joined_at         AS joinedAt
        FROM user_groups ug
                 INNER JOIN users u ON ug.user_id = u.user_id
                 INNER JOIN user_group_roles ur ON ur.group_id = ug.group_id AND ur.user_id = u.user_id
        WHERE ug.group_id = ?
        GROUP BY ug.group_id, u.user_id, u.username, ur.role;
    `, groupId);
    return data.map((member: GroupMemberDBRow): GroupMember => ({
        groupId: member.groupId,
        userGroupId: member.userGroupId,
        userId: member.userId,
        username: member.username,
        joinedAt: member.joinedAt,
        userRoles: member.userRolesString ? member.userRolesString.split(',') : [],
        profilePicture: member.profilePicture ?? ''
    }));
}

async function SyncMembers(groupId: string) {

    const data = await getGroupMembersFromBackend(groupId);
    await storeGroupMembers(data.members);
    await deleteGroupMembers(data.deletedIds);
}


async function getGroupMembersFromBackend(groupId: string): Promise<GroupMemberSyncResponse> {
    const url = BACKEND_URL + 'sync/group/members?groupId=' + groupId;
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    const data = await res.json();

    return {
        members: Array.isArray(data.members) ? data.members : [],
        deletedIds: Array.isArray(data.deletedIds) ? data.deletedIds : [],
    };
}

async function storeGroupMembers(data: GroupMember[]) {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        for (const member of data) {

            await db.runAsync(`
                INSERT
                OR REPLACE INTO users (user_id, username, profile_picture, last_sync) 
            VALUES (?, ?, ?, ?);
            `, member.userId, member.username, member.profilePicture ?? '', now)

            await db.runAsync(`
                INSERT
                OR REPLACE INTO user_groups (id, group_id, user_id, joined_at, last_sync) 
                VALUES (?, ?, ?, ?, ?);
            `, member.userGroupId, member.groupId, member.userId, member.joinedAt,now);
        }
    });
}

async function deleteGroupMembers(userGroupIds: string[]): Promise<void> {
    await db.withTransactionAsync(async () => {
        for (const userGroupId of userGroupIds) {
            await db.runAsync(`
                DELETE FROM user_groups
                WHERE id = ?;
            `, userGroupId);
        }
    });
}