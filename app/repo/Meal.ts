import {NewMealType} from "../screens/newMeal";
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";
import {MealCard} from "./Group";
import {handleDefaultResponseAndHeaders} from "../utility/Response";
import {getBasicAuthHeader} from "../utility/Auth";

export interface NewMealResponse {
    mealId: string,
}

export interface MealInterface {
    mealInformation: MealCard,
    mealParticipants: MealParticipants[]
}

export interface MealParticipants {
    userId: string,
    username: string,
    profilePicture?: string,
    preference: string,
    isCook: boolean,
}

export async function createNewMeal(newMeal: NewMealType, authToken: string): Promise<NewMealResponse> {

    const url = BACKEND_URL + 'meals'
    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        body: JSON.stringify(newMeal)
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    await handleDefaultResponseAndHeaders(res)
    return await res.json()
}

export async function getMealData(mealId: string, authToken: string): Promise<MealInterface> {
    const url = BACKEND_URL + 'meals/' + mealId

    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    await handleDefaultResponseAndHeaders(res)

    return await res.json()
}