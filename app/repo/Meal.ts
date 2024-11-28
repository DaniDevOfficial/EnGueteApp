import {NewMealType} from "../screens/newMeal";
import {BACKEND_URL} from '@env';
import {timeoutPromiseFactory} from "../Util";


export async function createNewMeal(newMeal: NewMealType, authToken: string): Promise<any> {
    try {
        const url = BACKEND_URL + '/meals'

        const timeoutPromise = timeoutPromiseFactory()

        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': authToken
            },
            body: JSON.stringify(newMeal)
        });


    } catch (e) {

    }
} 