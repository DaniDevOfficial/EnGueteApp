// @ts-ignore
import {BACKEND_URL} from '@env';
import {ForbiddenError, timeoutPromiseFactory, UnauthorizedError} from "../Util";

export interface Group {
    groupInfo: GroupInformation
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

export async function GetGroupInformation(groupId: string, authToken: string): Promise<Group> {

    const timeoutPromise = timeoutPromiseFactory()
    const url = BACKEND_URL + 'groups/' + groupId
    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
        }
    })
    const res = await Promise.race([fetchPromise, timeoutPromise]);
    const resData = await res.json();
    console.log(resData)
    if (!res.ok) {
        if (res.status === 401) {
            throw new UnauthorizedError('Unauthorized');
        }

        if (res.status === 403) {
            throw new ForbiddenError('Not allowed')
        }

        throw new Error(resData.error || 'Login failed. Please try again.');
    }
    return resData;
}
