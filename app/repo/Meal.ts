import {NewMealType} from "../screens/newMeal";
import {BACKEND_URL} from '@env';
import {ForbiddenError, timeoutPromiseFactory, UnauthorizedError} from "../Util";

export interface NewMealResponse {
    mealId: string,
}

export async function createNewMeal(newMeal: NewMealType, authToken: string): Promise<NewMealResponse> {
    try {
        const url = BACKEND_URL + 'meals'
        console.log(authToken)
        const timeoutPromise = timeoutPromiseFactory()

        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(newMeal)
        });

        const res = await Promise.race([fetchPromise, timeoutPromise]);
        const resData = await res.json();

        if (!res.ok) {
            if (res.status === 500) {
                throw new Error('Internal Server error.');
            }

            if (res.status === 401) {
                throw new UnauthorizedError('Unauthorized');
            }

            if (res.status === 403) {
                throw new ForbiddenError('Not allowed')
            }

            throw new Error(resData.error || 'Meal Creation failed. Please try again.');
        }

        if (resData) {
            return resData
        }
        throw new Error('123')
    } catch (e) {
        throw new Error(e.message || 'Meal Creation failed. Please try again.');
    }
} 