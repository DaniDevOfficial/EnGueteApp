import {BACKEND_URL} from '@env';
import {getBasicAuthHeader} from "../../utility/Auth";
import {timeoutPromiseFactory} from "../../Util";
import {handleDefaultResponseAndHeaders} from "../../utility/Response";

export async function updateUsername(newUsername: string) {
    const url = BACKEND_URL + 'users/username/';

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
    const url = BACKEND_URL + 'users/';
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(url, {
        method: 'DELETE',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res);
    return await res.json();
}