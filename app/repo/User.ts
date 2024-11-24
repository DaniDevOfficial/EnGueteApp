// @ts-ignore
import { BACKEND_URL } from '@env';
import {timeoutPromiseFactory, UnauthorizedError} from "../Util";

export interface User {
    userId: string;
    username: string;
    profileImageUrl?: string;
    groups: Group[];
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
        throw new Error("Failed to decode JWT.");
    }
    const timeoutPromise = timeoutPromiseFactory()

    const url = BACKEND_URL + 'users/' + payload['UserId']
    const fetchPromise = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
        }
    })
    const res = await Promise.race([fetchPromise, timeoutPromise]);
    const resData = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            throw new UnauthorizedError('Unauthorized');
        }

        throw new Error(resData.error || 'Login failed. Please try again.');
    }
    return resData;
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
        console.error("Failed to decode JWT:", error);
        return null;
    }
}
