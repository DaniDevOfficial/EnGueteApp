// @ts-ignore
import {BACKEND_URL} from '@env';
import {db, needsToBeSynced, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {getBasicAuthHeader, GetSafeCurrentUserId} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";
import {FRONTEND_ERRORS, IsOfflineError, TimeoutError} from "../../../utility/Errors";
import {isDeviceOffline} from "../../../utility/Network/OnlineOffline";

interface UserInformation {
    userId: string;
    username: string;
    profilePicture?: string;
}
const cacheKey = 'currentUser';

export async function syncCurrentUser(): Promise<UserInformation> {
    const isOffline = await isDeviceOffline();
    const shouldSkipSync = !await needsToBeSynced(cacheKey);
    if (shouldSkipSync || isOffline) {
        const cachedUser = await getCurrentUser()
        if (cachedUser) {
            return cachedUser;
        }
        if (isOffline) {
            throw new IsOfflineError(FRONTEND_ERRORS.IS_OFFLINE_ERROR);
        }
    }
    return await trySyncCurrentUser();
}

async function trySyncCurrentUser(): Promise<UserInformation> {
    try {
        const user = await getUserFromBackend();
        await storeUserInDatabase(user);
        await updateSyncStatus(cacheKey);
        return user;
    } catch (error) {
        if (error instanceof TimeoutError) {
            const cachedUser = await getCurrentUser();
            if (cachedUser) {
                return cachedUser;

            }
            throw new TimeoutError(FRONTEND_ERRORS.NO_CONNECTION_TO_THE_SERVER_ERROR);
        }
        throw error;
    }
}

async function getUserFromBackend(): Promise<UserInformation> {
    const timeoutPromise = timeoutPromiseFactory()
    const url = BACKEND_URL + 'users/';

    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();
}

async function storeUserInDatabase(user: UserInformation): Promise<void> {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();

        await db.runAsync(`
                    INSERT INTO users (user_id, username, profile_picture, last_sync)
                    VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO
                    UPDATE SET
                        username = excluded.username,
                        profile_picture = excluded.profile_picture,
                        last_sync = excluded.last_sync;
            `,
            user.userId,
            user.username,
            user.profilePicture ?? '',
            now);
    });
}

export async function getCurrentUser(): Promise<UserInformation | null> {
    const userId = await GetSafeCurrentUserId();
    return await db.getFirstAsync<UserInformation>(`SELECT user_id AS userId, username, profile_picture AS profilePicture
                                                    FROM users
                                                    WHERE user_id = ?`, userId);
}

