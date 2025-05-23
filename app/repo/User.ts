// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {getBasicAuthHeader} from "../utility/Auth";
import {FRONTEND_ERRORS, UnauthorizedError} from "../utility/Errors";
import {handleDefaultResponseAndHeaders} from "../utility/Response";

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
