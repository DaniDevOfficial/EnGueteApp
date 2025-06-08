// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {getBasicAuthHeader} from "../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../utility/Response";
import {needsToBeSynced} from "../utility/database";
import {
    getGroupInformation,
    GroupInformationResponse,
    singleGroupCacheKeySuffixId,
    TrySyncGroup
} from "./sync/group/information";
import {isDeviceOffline} from "../utility/Network/OnlineOffline";
import {buildCacheKey, buildDateDuration, getMeals, TrySyncMeals} from "./sync/meal/AllMealsInGroup";
import {getGroupMembers, groupMembersCacheKey, TrySyncGroupMembers} from "./sync/group/memberList";

export interface Group {
    groupInfo: GroupInformation
    meals?: MealCard[]
}

export interface GroupResponse {
    groupInfo: GroupInformationResponse
    meals?: MealCard[]
}

export interface GroupInformation {
    groupId: string,
    groupName: string,
    userCount: string,
    userRoles: string[],
    userRoleRights: string[],
}

export interface MealCard {
    mealId: string,
    groupId: string,
    title: string,
    closed: boolean,
    fulfilled: boolean,
    dateTime: string,
    mealType: string,
    notes: string,
    participantCount: number,
    userPreference: string,
    isCook: boolean,
}

export interface NewGroupType {
    groupName: string,
}

export interface GroupIdResponse {
    groupId: string,
}

export interface GroupMember {
    groupId: string,
    userId: string,
    userGroupId: string,
    joinedAt: string,
    username: string,
    userRoles: string[],
    profilePicture?: string,
}

export interface RoleChangeRequest {
    groupId: string,
    userId: string,
    role: string,
}

export interface KickUserRequest {
    groupId: string,
    userId: string,
}


export async function GetGroupInformation(groupId: string): Promise<GroupResponse> {
    const isOffline = await isDeviceOffline();
    const shouldSkipSync = !await needsToBeSynced(singleGroupCacheKeySuffixId + groupId);

    if (shouldSkipSync || isOffline) {
        return {
            groupInfo: await getGroupInformation(groupId),
        };
    }

    const groupInformation = await TrySyncGroup(groupId)
    return {
        groupInfo: groupInformation,
    }
}

export async function CreateNewGroup(groupInformation: NewGroupType): Promise<GroupIdResponse> {
    const url = BACKEND_URL + 'groups';
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(groupInformation),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export interface UpdateGroupNameType {
    groupId: string,
    groupName: string,
}

export async function UpdateGroupName(groupInformation: UpdateGroupNameType): Promise<GroupIdResponse> {
    const url = BACKEND_URL + 'groups/name';
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'PUT',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(groupInformation),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function DeleteGroupRequest(groupId: string): Promise<GroupIdResponse> {
    const url = BACKEND_URL + 'groups?groupId=' + groupId;
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'DELETE',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function LeaveGroupRequest(groupId: string): Promise<GroupIdResponse> {
    const url = BACKEND_URL + 'groups/leave?groupId=' + groupId;
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'DELETE',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function GetGroupMemberList(groupId: string): Promise<GroupMember[]> {

    const isOffline = await isDeviceOffline();
    const shouldSkipSync = !await needsToBeSynced(groupMembersCacheKey + groupId);

    if (shouldSkipSync || isOffline) {
        return await getGroupMembers(groupId);
    }

    return await TrySyncGroupMembers(groupId);
}

export enum RoleChange {
    PROMOTION,
    DEMOTION,
}

export async function ChangeRole(requestData: RoleChangeRequest, roleChange: RoleChange) {
    let url = BACKEND_URL + 'management/roles/add';
    if (roleChange === RoleChange.DEMOTION) {
        url = BACKEND_URL + 'management/roles/remove';
    }
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(requestData),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function KickUserFromGroup(requestData: KickUserRequest) {
    const url = BACKEND_URL + 'management/user/kick';
    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(requestData),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

export async function GetGroupMeals(groupId: string, date: string): Promise<MealCard[]> {
    const dateObject = new Date(date);

    const isOffline = await isDeviceOffline();
    const shouldSkipSync = !await needsToBeSynced(buildCacheKey(groupId, dateObject));

    if (shouldSkipSync || isOffline) {
        return getMeals(groupId, dateObject);
    }

    const dates = buildDateDuration(dateObject);
    return TrySyncMeals(groupId, dates);
}

