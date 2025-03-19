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