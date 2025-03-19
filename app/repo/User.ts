// @ts-ignore
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {getBasicAuthHeader} from "../utility/Auth";
import {UnauthorizedError} from "../utility/Errors";

export interface User {
    userId: string;
    username: string;
    profilePicture?: string;
    groups: Group[];
}

export type UserCard = {
    userName: string;
    userId: string;
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
        throw new UnauthorizedError('Untauthorized');
    }
    const timeoutPromise = timeoutPromiseFactory()
    const url = BACKEND_URL + 'users/' + payload['UserId']

    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    return await res.json();
}

type JWTPayload = {
    UserId: string;
    Username: string;
    Exp: number;
};


function decodeJwt(token: string): JWTPayload {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            throw new Error("Invalid JWT token format.");
        }

        const payload = parts[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        return null;
    }
}
