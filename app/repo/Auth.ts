import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {handleDefaultResponseAndHeaders} from "../utility/Response";
import {FRONTEND_ERRORS, TimeoutError, UnauthorizedError} from "../utility/Errors";
import {getAuthToken, getBasicAuthHeader, getRefreshToken} from "../utility/Auth";

type ResponseAuth = {
    token: string;
};


export async function SignIntoAccount(
    username: string,
    password: string
): Promise<ResponseAuth> {
    const url = `${BACKEND_URL}auth/signin`;

    const data = {
        username,
        password,
    };

    const timeoutPromise = timeoutPromiseFactory();

    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json();

}


export async function CreateNewAccount(
    username: string,
    email: string,
    password: string,
): Promise<ResponseAuth> {
    const url = `${BACKEND_URL}auth/signup`;

    const data = {
        username: username,
        email: email,
        password: password,
    };

    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res);
    return await res.json();

}

export async function checkAuth() {
    const authToken = await getAuthToken();
    if (authToken === null) {
        throw new UnauthorizedError(FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
    }
    const refreshToken = await getRefreshToken();
    if (refreshToken === null) {
        throw new UnauthorizedError(FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
    }
    const URL = BACKEND_URL + 'auth/check';
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(URL, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    try {
        const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return;
        }
        throw error
    }

    await handleDefaultResponseAndHeaders(res);
}
