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
    mealId: string,
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
        headers: await getBasicAuthHeader(),
        body: JSON.stringify(newMeal)
    });

    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    await handleDefaultResponseAndHeaders(res)
    return await res.json()
}

export async function getMealData(mealId: string): Promise<MealInterface> {
    const url = BACKEND_URL + 'meals?mealId=' + mealId

    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    await handleDefaultResponseAndHeaders(res)

    return await res.json()
}

export async function saveMealPreference(userId: string, mealId: string, preference: string | null, isCook: boolean | null): Promise<void> {
    const url = BACKEND_URL + 'meals/preferences'
    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'PUT',
        headers: await getBasicAuthHeader(),
        body: JSON.stringify({
            userId: userId,
            mealId: mealId,
            preference: preference,
            isCook: isCook
        })
    });

    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json()
}