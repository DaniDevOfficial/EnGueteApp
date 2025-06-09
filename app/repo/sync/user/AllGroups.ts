// @ts-ignore
import {BACKEND_URL} from '@env';
import {db, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {getBasicAuthHeader} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";
import {Group} from "../../User";
import {TimeoutError} from "../../../utility/Errors";

interface GroupSync {
    groups: Group[] | null;
    deletedIds: string[] | null;
}

export const userGroupsCacheKey = 'userGroups';


export async function SyncAllGroups(): Promise<void> {
    const data = await GetAllGroupsFromBackend();
    await storeAllGroupsInDatabase(data)

}

export async function TrySyncAllGroups(): Promise<Group[]> {
    try {
        await SyncAllGroups();
        await updateSyncStatus(userGroupsCacheKey);

        return await getAllGroups();
    } catch (error) {
        if (error instanceof TimeoutError) {
            const cachedGroups = await getAllGroups();
            return cachedGroups;
        }
        throw error;
    }
}

async function GetAllGroupsFromBackend(): Promise<GroupSync> {
    const url = BACKEND_URL + 'sync/groups';
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

async function storeAllGroupsInDatabase(groupSyncData: GroupSync): Promise<void> {
    const now = new Date().toISOString();
    const groups = groupSyncData.groups;
    if (groups) {
        await db.withTransactionAsync(async () => {
            for (const group of groups) {
                await db.runAsync(`
                            INSERT INTO groups (group_id, group_name, user_count, last_sync)
                            VALUES (?, ?, ?, ?) ON CONFLICT(group_id) DO
                            UPDATE SET
                                group_name = excluded.group_name,
                                user_count = excluded.user_count,
                                last_sync = excluded.last_sync;
                    `,
                    group.groupId,
                    group.groupName,
                    group.userCount,
                    now);
            }
        });
    }

    if (groupSyncData.deletedIds?.length) {
        await db.runAsync(
            `DELETE
             FROM groups
             WHERE group_id IN (${groupSyncData.deletedIds.map(() => '?').join(',')})`,
            ...groupSyncData.deletedIds
        );
    }
}


export async function getAllGroups(): Promise<Group[]> {
    return await db.getAllAsync(`SELECT group_id   as groupId,
                                        group_name AS groupName,
                                        user_count AS userCount,
                                        ''         AS nextMealDate
                                 FROM groups
                                 ORDER BY group_name ASC`);
}