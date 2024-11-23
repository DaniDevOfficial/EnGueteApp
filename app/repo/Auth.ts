import { BACKEND_URL } from '@env';

type ResponseAuth = [
    token: string
]
export async function SignIntoAccount(username: string, password: string): Promise<ResponseAuth> {
    const url = BACKEND_URL + 'auth/signin'
    console.log(url)
    const data = {
        username: username,
        password: password
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const resData = await res.json()
    console.log(resData)
    if (!res.ok) {
        throw new Error(resData['error'])
    }
    return resData;
}