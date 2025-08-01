// @ts-ignore

import {getBasicAuthHeader} from "../../utility/Auth";
import {timeoutPromiseFactory} from "../../Util";
import {handleDefaultResponseAndHeaders, handleResponse} from "../../utility/Response";

export async function updateUsername(newUsername: string) {
    const url = process.env.EXPO_PUBLIC_API_URL + 'users/username/';

    const data = {
        username: newUsername,
    };
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(url, {
        method: 'PUT',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(data),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res);
    return await res.json();
}

export async function deleteCurrentUser() {
    const url = process.env.EXPO_PUBLIC_API_URL + 'users/';
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(url, {
        method: 'DELETE',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res);
    return await res.json();
}

export async function handleBackendLogout() {
    const url = process.env.EXPO_PUBLIC_API_URL + 'auth/logout/';
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    handleResponse(res);
    return await res.json();
}