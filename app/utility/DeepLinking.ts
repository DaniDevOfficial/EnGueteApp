import AsyncStorage from "@react-native-async-storage/async-storage";



export async function removePendingInviteToken() {
    await AsyncStorage.removeItem('pendingInviteToken');
}

export async function setPendingInviteToken(token: string) {
    await AsyncStorage.setItem('pendingInviteToken', token);
}

export async function getPendingInviteToken() {
    return await AsyncStorage.getItem('pendingInviteToken');
}