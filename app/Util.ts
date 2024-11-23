import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_STRING = 'authToken';

export async function saveAuthToken(value: string) {
        await AsyncStorage.setItem(AUTH_TOKEN_STRING, value);
}

export async function getAuthToken() {
        return await AsyncStorage.getItem(AUTH_TOKEN_STRING);
}