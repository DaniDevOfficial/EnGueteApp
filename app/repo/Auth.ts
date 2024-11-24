import { BACKEND_URL } from '@env';
import {timeoutPromiseFactory} from "../Util";

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

    const timeoutPromise = timeoutPromiseFactory()

    try {
        console.log('Sending sign-in request:', url, data);
        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const res = await Promise.race([fetchPromise, timeoutPromise]);
        const resData = await res.json();
        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Incorrect username or password.');
            }

            throw new Error(resData.error || 'Login failed. Please try again.');
        }

        return resData;
    } catch (error: any) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse server response. Please try again later.');
        }

        if (error instanceof TypeError) {
            throw new Error(
                'Unable to connect to the server. Please check your internet connection.'
            );
        }

        throw new Error(error.message || 'An unexpected error occurred.');
    }
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
    console.log(data)
    const timeoutPromise = timeoutPromiseFactory()

    try {
        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const res = await Promise.race([fetchPromise, timeoutPromise]);
        const resData = await res.json();
        if (!res.ok) {
            if (res.status === 500) {
                throw new Error('Internal Server error.');
            }

            throw new Error(resData.error || 'Login failed. Please try again.');
        }

        return resData;
    } catch (error: any) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse server response. Please try again later.');
        }

        if (error instanceof TypeError) {
            throw new Error(
                'Unable to connect to the server. Please check your internet connection.'
            );
        }

        throw new Error(error.message || 'An unexpected error occurred.');
    }
}
