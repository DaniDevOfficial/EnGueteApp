import {useNavigation} from "@react-navigation/native";
import {removeAuthToken, removeRefreshToken} from "./utility/Auth";
import {resetToHomeScreen} from "./utility/navigation";
import {TimeoutError} from "./utility/Errors";

const TIMEOUT = 3000;
type NavigationType = ReturnType<typeof useNavigation>;

export async function voidAuthToken() {
    await removeAuthToken()
    await removeRefreshToken()
}


export async function handleLogoutProcedure(navigation: NavigationType) {
    await voidAuthToken()
    //TODO: remove user data from context
    //TODO: delte userdata from sqlite
    resetToHomeScreen(navigation);
}



export function timeoutPromiseFactory<T>(
    timeout: number = TIMEOUT,
    errorMessage = 'Request timed out. Please try again later.'
): Promise<T> {
    return new Promise<never>((_, reject) =>
        setTimeout(() => reject(new TimeoutError(errorMessage)), timeout)
    );
}


