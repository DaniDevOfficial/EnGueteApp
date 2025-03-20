const TIMEOUT = 10000;

export async function handleLogoutProcedure() {
    // await saveAuthToken('')
}

export function timeoutPromiseFactory<T>(
    timeout: number = TIMEOUT,
    errorMessage = 'Request timed out. Please try again later.'
): Promise<T> {
    return new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), timeout)
    );
}


