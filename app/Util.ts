import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_STRING = 'authToken';

export async function saveAuthToken(value: string) {
        await AsyncStorage.setItem(AUTH_TOKEN_STRING, value);
}

export async function getAuthToken() {
        return await AsyncStorage.getItem(AUTH_TOKEN_STRING);
}
const TIMEOUT = 10000;

export async function handleLogoutProcedure() {
       // await saveAuthToken('')
}

export function timeoutPromiseFactory<T>(
    timeout: number = TIMEOUT,
    errorMessage = 'Request timed out. Please try again later.'
): Promise<T> {
        return new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(errorMessage)), timeout)
        );
}


