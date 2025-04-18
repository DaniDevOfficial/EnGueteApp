import {NavigationProp} from "@react-navigation/native";
import {removeAuthToken, removeRefreshToken, saveAuthToken} from "./utility/Auth";
import {resetToHomeScreen} from "./utility/navigation";

const TIMEOUT = 10000;

export async function handleLogoutProcedure(navigation: NavigationProp<any>) {
    await removeAuthToken()
    await removeRefreshToken()
    //TODO: remove user data from context
    //TODO: delte userdata from sqlite
    resetToHomeScreen(navigation);
}

export function timeoutPromiseFactory<T>(
    timeout: number = TIMEOUT,
    errorMessage = 'Request timed out. Please try again later.'
): Promise<T> {
    return new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), timeout)
    );
}


