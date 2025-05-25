// @ts-ignore
import {BACKEND_URL} from '@env';
import {needsToBeSynced, updateSyncStatus} from "../utility/database";
import {getAllGroups, SyncAllGroups} from "./sync/user/AllGroups";
import {isDeviceOffline} from "../utility/Network/OnlineOffline";
import {syncCurrentUser} from "./sync/user/UserInformation";

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
    userCount: number;
    nextMealDate: string;
}



export async function GetUserInformation(): Promise<User> {
    const userData = await syncCurrentUser();
    const groups = await GetUserGroups();
    return {
        userId: userData.userId,
        username: userData.username,
        profilePicture: userData.profilePicture,
        groups: groups,
    };
}

export async function GetUserGroups(): Promise<Group[]> {
    const cacheKey = 'userGroups';
    const isOffline = await isDeviceOffline();
    const shouldSkipSync = !await needsToBeSynced(cacheKey);

    if (shouldSkipSync || isOffline) {
        return await getAllGroups();
    }
    await SyncAllGroups();
    await updateSyncStatus(cacheKey);

    return await getAllGroups();
}


