import {FRONTEND_ERRORS, UnauthorizedError} from "./Errors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_STRING = 'authToken';
const REFRESH_TOKEN_STRING = 'refreshToken';


export async function handleAuthorisationKeysFromHeader(header: Headers) {
    const authToken = header.get('Authorization');
    const refreshToken = header.get('RefreshToken');

    if (authToken !== null) {
        await saveAuthToken(authToken);
    }
    if (refreshToken !== null) {
        await saveRefreshToken(refreshToken)
    }
}


export async function getBasicAuthHeader(): Promise<SimpleAuthHeaderWithJson> {
    const refreshToken = await getRefreshToken();
    const authToken = await getAuthToken() ?? '';
    if (!refreshToken) {
        throw new UnauthorizedError(FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
    }
    return {
        RefreshToken: refreshToken,
        Authorization: authToken,
        'Content-Type': 'application/json',
    };
}

export interface SimpleAuthHeaderWithJson extends Record<string, string> {
    RefreshToken: string;
    Authorization: string;
    'Content-Type': string;
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


// GET
export async function getAuthToken() {
    return await AsyncStorage.getItem(AUTH_TOKEN_STRING);
}
export async function getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_STRING);
}



export async function GetCurrentUserId(): Promise<string | null> {
    const authToken = await getRefreshToken();
    if (!authToken) {
        return null;
    }
    const payload = decodeJwt(authToken);
    return payload?.UserId || null;
}

export async function GetSafeCurrentUserId(): Promise<string> {
    const userId = await GetCurrentUserId();
    if (!userId) {
        throw new UnauthorizedError(FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
    }
    return userId;
}

// SAVE
export async function saveAuthToken(value: string) {
    await AsyncStorage.setItem(AUTH_TOKEN_STRING, value);
}
export async function saveRefreshToken(value: string) {
    await AsyncStorage.setItem(REFRESH_TOKEN_STRING, value);
}

// DELETE
export async function removeAuthToken() {
    await AsyncStorage.removeItem(AUTH_TOKEN_STRING);
}
export async function removeRefreshToken() {
    await AsyncStorage.removeItem(REFRESH_TOKEN_STRING);
}