import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {handleDefaultResponseAndHeaders} from "../utility/Response";

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
    console.log('signIntoAccount')
    console.log(res)
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
