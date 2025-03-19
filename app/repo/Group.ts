// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {handleAuthorisationKeysFromHeader} from "../utility/Auth";

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
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    handleAuthorisationKeysFromHeader(res)

    return await res.json();
}
