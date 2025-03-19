import {UnauthorizedError} from "./Errors";

export function handleAuthorisationKeysFromHeader(header: Headers) {
    const authHeader = header.get('Authorization');
    const refreshToken = header.get('RefreshToken');

    if (authHeader !== null) {
        localStorage.setItem('Authorization', authHeader);
    }
    if (refreshToken !== null) {
        localStorage.setItem('RefreshToken', refreshToken);
    }
}


export function getBasicAuthHeader(): SimpleAuthHeaderWithJson {
    const refreshToken = getRefreshToken();
    const authToken = getAuthToken() ?? '';
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

export function getRefreshToken() {
    return localStorage.getItem('RefreshToken');
}

export function getAuthToken() {
    return localStorage.getItem('Authorization');
}
