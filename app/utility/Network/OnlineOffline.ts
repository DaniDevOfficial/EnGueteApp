import NetInfo from '@react-native-community/netinfo';

export async function isDeviceOffline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return !netInfo.isConnected && !netInfo.isInternetReachable;
}