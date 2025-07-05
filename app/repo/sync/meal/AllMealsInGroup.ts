// @ts-ignore
import {BACKEND_URL} from '@env';
import {MealCard} from "../../Group";
import {getFirstDayOfLastMonth, getLastDayOfNextMonth, getWeekDuration} from "../../../utility/Dates";
import {db, updateSyncStatus} from "../../../utility/database";
import {TimeoutError} from "../../../utility/Errors";
import {timeoutPromiseFactory} from "../../../Util";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";
import {getBasicAuthHeader} from "../../../utility/Auth";

export interface DateDuration {
    startDate: Date;
    endDate: Date;
    currentWeekDate: Date;
}

interface MealsSyncResponse {
    meals: MealCard[];
    deletedIds: string[];
}

// Structure is: base + groupId + _ + year + _ month
export const cacheKeyBase = 'groupMeals_'

export async function TrySyncMeals(groupId: string, dates: DateDuration): Promise<MealCard[]> {
    try {
        await SyncAllMeals(groupId, dates);
        await handleSyncStateKeys(groupId, dates);
        return await getMeals(groupId, dates.currentWeekDate);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return await getMeals(groupId, dates.currentWeekDate);
        }
        throw error;
    }
}

async function SyncAllMeals(groupId: string, dates: DateDuration): Promise<void> {
    const mealResponse = await getMealsFromBackend(groupId, dates);
    await storeMealsInDatabase(mealResponse.meals);
    await deleteMealsInDatabase(mealResponse.deletedIds);
}

async function getMealsFromBackend(groupId: string, dates: DateDuration): Promise<MealsSyncResponse> {
    const url = BACKEND_URL + 'sync/group/meals?groupId=' + groupId + '&startDate=' + dates.startDate.toISOString() + '&endDate=' + dates.endDate.toISOString();

    const timeoutPromise = timeoutPromiseFactory()
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    const data = await res.json();

    return {
        meals: Array.isArray(data.meals) ? data.meals : [],
        deletedIds: Array.isArray(data.deletedIds) ? data.deletedIds : [],
    };
}

export async function storeMealsInDatabase(meals: MealCard[] | MealCard): Promise<void> {
    const now = new Date().toISOString();
    const mealList = Array.isArray(meals) ? meals : [meals];

    await db.withTransactionAsync(async () => {
        for (const meal of mealList) {
            await db.runAsync(`
                        INSERT INTO meals (
                            meal_id, group_id, title, closed, fulfilled, date_time,
                            meal_type, notes, participant_count, user_preference,
                            is_cook, last_sync
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON CONFLICT(meal_id) DO UPDATE SET
                            group_id = excluded.group_id,
                                                        title = excluded.title,
                                                        closed = excluded.closed,
                                                        fulfilled = excluded.fulfilled,
                                                        date_time = excluded.date_time,
                                                        meal_type = excluded.meal_type,
                                                        notes = excluded.notes,
                                                        participant_count = excluded.participant_count,
                                                        user_preference = excluded.user_preference,
                                                        is_cook = excluded.is_cook,
                                                        last_sync = excluded.last_sync;
                `,
                meal.mealId,
                meal.groupId,
                meal.title,
                meal.closed,
                meal.fulfilled,
                meal.dateTime,
                meal.mealType,
                meal.notes,
                meal.participantCount,
                meal.userPreference,
                Number(meal.isCook),
                now);
        }
    });
}


async function deleteMealsInDatabase(mealIds: string[]): Promise<void> {
    await db.withTransactionAsync(async () => {
        for (const mealId of mealIds) {

            await db.runAsync(`
                DELETE
                FROM meals
                WHERE meal_id = ?;
            `, mealId);
        }
    })
}

interface MealFromDatabase {
    mealId: string;
    title: string;
    closed: boolean;
    fulfilled: boolean;
    dateTime: string;
    mealType: string;
    notes: string | null;
    participantCount: number;
    userPreference: string | null;
    isCook: boolean;
}

export async function getMeals(groupId: string, date: Date): Promise<MealCard[]> {

    const {start, end} = getWeekDuration(date);


    const data =    await db.getAllAsync<MealCard>(`
        SELECT meal_id           AS mealId,
               title,
               closed,
               fulfilled,
               date_time         AS dateTime,
               meal_type         AS mealType,
               notes             AS notes,
               participant_count AS participantCount,
               user_preference   AS userPreference,
               is_cook           AS isCook
        FROM meals
        WHERE group_id = ?
          AND date_time >= ?
          AND date_time <= ?
        ORDER BY date_time ASC;
    `, groupId, start.toISOString(), end.toISOString());

    data.map(meal => {
        meal.isCook = !(!Number(meal.isCook));
        meal.fulfilled = !(!Number(meal.fulfilled));
        meal.closed = !(!Number(meal.closed));
        meal.participantCount = Number(meal.participantCount);
    })

    return data;
}

async function handleSyncStateKeys(groupId: string, dates: DateDuration): Promise<void> {
    let current = new Date(dates.startDate);

    const end = new Date(dates.endDate);
    end.setDate(1);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        const cacheKey = buildCacheKey(groupId, current);
        await updateSyncStatus(cacheKey);

        current = new Date(current.getFullYear(), current.getMonth() + 1, 1, 0, 0, 0, 0);
    }
}

export function buildCacheKey(groupId: string, date: Date): string {
    return cacheKeyBase + groupId + '_' + date.getFullYear() + '_' + (date.getMonth() + 1);
}

export function buildDateDuration(date: Date): DateDuration {
    return {
        currentWeekDate: date,
        startDate: getFirstDayOfLastMonth(date),
        endDate: getLastDayOfNextMonth(date),
    }
}

