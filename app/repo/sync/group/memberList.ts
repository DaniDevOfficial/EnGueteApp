// @ts-ignore
import {BACKEND_URL} from '@env';
import {GroupMember} from "../../Group";
import {db, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {TimeoutError} from "../../../utility/Errors";
import {getBasicAuthHeader} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";

const groupMembersCacheKey = "groupMembers_";

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
    groupId: string
    userId: string
    username: string
    userRolesString: string | null
    profilePicture: string | null
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const data = await db.getAllAsync<GroupMemberDBRow>(`
        SELECT ug.group_id,
               u.user_id,
               u.username,
               group_concat(ur.role) AS userRolesString,
               u.profile_picture     AS profilePicture,
        FROM user_groups ug
                 INNER JOIN users u ON ug.user_id = u.user_id
                 INNER JOIN user_group_roles ur ON ur.group_id = ug.group_id AND ur.user_id = u.user_id
        WHERE ug.group_id = ?
        GROUP BY ug.group_id, u.user_id, u.username, ur.role;
    `, groupId);
    return data.map((member: GroupMemberDBRow): GroupMember => ({
        groupId: member.groupId,
        userId: member.userId,
        username: member.username,
        userRoles: member.userRolesString ? member.userRolesString.split(',') : [],
        profilePicture: member.profilePicture ?? ''
    }));
}

async function SyncMembers(groupId: string) {
    const data = await getGroupMembers(groupId);
}


async function getGroupMembersFromBackend(groupId: string): Promise<any> {
    const url = BACKEND_URL + 'sync/groups/members?groupId=' + groupId;
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

async function storeGroupMembers(data: GroupMember[]) {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        for (const member of data) {

            await db.runAsync(`
                INSERT
                OR REPLACE INTO users (user_id, username, profile_picture, last_sync) 
            VALUES (?, ?, ?);
            `, member.userId, member.username, member.profilePicture ?? '', now)

            await db.runAsync(`
                INSERT
                OR REPLACE INTO user_groups (group_id, user_id, last_sync) 
                VALUES (?, ?, ?);
            `, member.groupId, member.userId, now);
        }
    });
}
