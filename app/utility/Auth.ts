import {UnauthorizedError} from "./Errors";
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
        throw new UnauthorizedError('Not authorized');
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


export async function saveAuthToken(value: string) {
    await AsyncStorage.setItem(AUTH_TOKEN_STRING, value);
}
export async function saveRefreshToken(value: string) {
    await AsyncStorage.setItem(REFRESH_TOKEN_STRING, value);

}

export async function getAuthToken() {
    return await AsyncStorage.getItem(AUTH_TOKEN_STRING);
}

export async function getTesting() {
    return await AsyncStorage.getItem('testing')
}

export async function getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_STRING);
}

