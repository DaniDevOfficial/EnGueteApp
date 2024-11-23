import { BACKEND_URL } from '@env';

type ResponseAuth = {
    token: string;
};
const TIMEOUT = 10000;

export async function SignIntoAccount(
    username: string,
    password: string
): Promise<ResponseAuth> {
    const url = `${BACKEND_URL}auth/signin`;

    const data = {
        username,
        password,
    };
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out. Please try again later.')), TIMEOUT)
    );

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
        console.error('Sign-in error:', error);
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
