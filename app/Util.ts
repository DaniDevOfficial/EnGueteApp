import {useNavigation} from "@react-navigation/native";
import {removeAuthToken, removeRefreshToken} from "./utility/Auth";
import {resetToHomeScreen} from "./utility/navigation";
import {FRONTEND_ERRORS, TimeoutError} from "./utility/Errors";
import {clearDatabase} from "./utility/database";

const TIMEOUT = 3000;
type NavigationType = ReturnType<typeof useNavigation>;

export async function voidAuthToken() {
    await removeAuthToken()
    await removeRefreshToken()
}


export async function handleLogoutProcedure(navigation: NavigationType) {
    await voidAuthToken()
    await clearDatabase()
    //TODO: remove user data from context
    resetToHomeScreen(navigation);
}



export function timeoutPromiseFactory<T>(
    timeout: number = TIMEOUT,
    errorMessage = FRONTEND_ERRORS.NO_CONNECTION_TO_THE_SERVER_ERROR
): Promise<T> {
    return new Promise<never>((_, reject) =>
        setTimeout(() => reject(new TimeoutError(errorMessage)), timeout)
    );
}


