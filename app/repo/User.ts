// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {getBasicAuthHeader} from "../utility/Auth";
import {FRONTEND_ERRORS, UnauthorizedError} from "../utility/Errors";
import {handleDefaultResponseAndHeaders} from "../utility/Response";
import {checkIfCacheNeedsToBeSynced, db, updateSyncStatus} from "../utility/database";

export interface User {
    userId: string;
    username: string;
    profilePicture?: string;
    groups: Group[];
}

export type UserCard = {
    userId: string;
    userName: string;
    profilePicture?: string;
}

export interface Group {
    groupId: string;
    groupName: string;
    amountOfPeopleInGroup: bigint;
    nextMealDate: string;
}


export async function GetUserInformation(authToken: string): Promise<User> {
    const payload = decodeJwt(authToken);
    if (!payload) {
        throw new UnauthorizedError(FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
    }
    const timeoutPromise = timeoutPromiseFactory()
    const url = BACKEND_URL + 'users/';

    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function GetUserGroups(): Promise<Group[]> {
    const url = BACKEND_URL + 'users/groups';
    const timeoutPromise = timeoutPromiseFactory()

    const cacheKey = 'userGroups';
    const needToSync = await checkIfCacheNeedsToBeSynced(cacheKey);
    if (needToSync) {
        await SyncAllGroups();
        await updateSyncStatus(cacheKey);
    }

    return await getAllGroups();
    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

type JWTPayload = {
    UserId: string;
    Username: string;
    Exp: number;
};

function decodeJwt(token: string): JWTPayload | null {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null
        }

        const payload = parts[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        return null;
    }
}

export async function GetAllGroupsFromBackend(): any {
    const url = BACKEND_URL + 'sync/groups';
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function SyncAllGroups(): Promise<void> {
    const data = await GetAllGroupsFromBackend();
    const groups = data.groups;
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        for (const group of groups) {
            await db.runAsync('INSERT OR REPLACE INTO groups (group_id, group_name, user_count, last_sync) VALUES (?, ?, ?, ?)', group.groupId, group.groupName, group.userCount, now);
        }
    })
    const allGroups = await db.getAllAsync('SELECT * FROM groups');
    //TODO: add delete handle
}

export async function getAllGroups(): Promise<Group[]> {
    return await db.getAllAsync(`SELECT group_id as groupId, group_name AS groupName, user_count AS amountOfPeopleInGroup, '' AS nextMealDate  FROM groups ORDER BY group_name ASC`);
}