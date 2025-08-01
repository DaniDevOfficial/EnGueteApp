// @ts-ignore

import {GroupMember} from "../../Group";
import {db, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {TimeoutError} from "../../../utility/Errors";
import {getBasicAuthHeader} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";

export const groupMembersCacheKey = "groupMembers_";


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
               ug.joined_at          AS joinedAt
        FROM user_groups ug
                 INNER JOIN users u ON ug.user_id = u.user_id
                 LEFT JOIN user_group_roles ur ON ur.group_id = ug.group_id AND ur.user_id = u.user_id
        WHERE ug.group_id = ?
        GROUP BY ug.id, ug.group_id, u.user_id, u.username, u.profile_picture, ug.joined_at;
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
    await handleLocalGroupMembersSync(data);
}


async function getGroupMembersFromBackend(groupId: string): Promise<GroupMemberSyncResponse> {
    const url = process.env.EXPO_PUBLIC_API_URL + 'sync/group/members?groupId=' + groupId;
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    const data = await res.json();

    return {
        members: Array.isArray(data.members) ? data.members : [],
        deletedIds: Array.isArray(data.deletedIds) ? data.deletedIds : [],
    };
}

export async function handleLocalGroupMembersSync(data: GroupMemberSyncResponse): Promise<void> {
    if (data.members.length > 0) {
        await storeGroupMembers(data.members);
    }

    if (data.deletedIds.length > 0) {
        await deleteGroupMembers(data.deletedIds);
    }
}

async function storeGroupMembers(data: GroupMember[]): Promise<void> {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();

        for (const member of data) {
            await db.runAsync(`
                INSERT INTO users (user_id, username, profile_picture, last_sync)
                VALUES (?, ?, ?, ?)
                    ON CONFLICT(user_id) DO UPDATE SET
                    username = excluded.username,
                                                profile_picture = excluded.profile_picture,
                                                last_sync = excluded.last_sync;
            `, member.userId, member.username, member.profilePicture ?? '', now);

            await db.runAsync(`
                INSERT INTO user_groups (id, group_id, user_id, joined_at, last_sync)
                VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                    joined_at = excluded.joined_at,
                                           last_sync = excluded.last_sync;
            `, member.userGroupId, member.groupId, member.userId, member.joinedAt, now);

            await db.runAsync(`
                DELETE FROM user_group_roles
                WHERE user_id = ? AND group_id = ?
            `, member.userId, member.groupId);

            for (const role of member.userRoles) {
                await db.runAsync(`
                    INSERT INTO user_group_roles (role, user_id, group_id)
                    VALUES (?, ?, ?)
                        ON CONFLICT(user_id, group_id, role) DO NOTHING;
                `, role, member.userId, member.groupId);
            }
        }
    });
}

async function deleteGroupMembers(userGroupIds: string[]): Promise<void> {
    await db.withTransactionAsync(async () => {
        for (const userGroupId of userGroupIds) {
            await db.runAsync(`
                DELETE
                FROM user_groups
                WHERE id = ?;
            `, userGroupId);
        }
    });
}