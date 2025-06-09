// @ts-ignore
import {BACKEND_URL} from '@env';
import {FRONTEND_ERRORS, NotFoundError, TimeoutError} from "../../../utility/Errors";
import {GetGroupMemberList, MealCard} from "../../Group";
import {MealInterface, MealPreference} from "../../Meal";
import {db, updateSyncStatus} from "../../../utility/database";
import {timeoutPromiseFactory} from "../../../Util";
import {getBasicAuthHeader} from "../../../utility/Auth";
import {handleDefaultResponseAndHeaders} from "../../../utility/Response";

import {DEFAULT_UNDECIDED_PREFERENCE} from "../../../utility/TextKeys/TextKeys";
import {storeMealsInDatabase} from "./AllMealsInGroup";

export const singularMealCacheKey = 'singularMeal_';

export async function TryAndSyncSingularMeal(mealId: string, groupId: string): Promise<MealInterface> {
    try {
        await SyncMealFromBackend(mealId);
        await GetGroupMemberList(groupId); // This is so we are up to date with the group members, so no unsynced participants are stored
        await updateSyncStatus(singularMealCacheKey + mealId);
        return getMeal(mealId);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return getMeal(mealId);
        }
        throw error;
    }
}

interface PreferenceSyncResponse {
    preferenceId: string;
    userGroupId: string;
    mealId: string;
    userId: string;
    isCook: boolean;
    preference: string;
}

interface MealPreferenceSyncResponse {
    preferences: PreferenceSyncResponse[];
    deletedIds: string[];
}

interface MealSyncResponse {
    mealInformation: MealCard;
    mealPreferences: MealPreferenceSyncResponse;
}

export async function getMeal(mealId: string): Promise<MealInterface> {
    return {
        mealInformation: await getMealInformation(mealId),
        mealPreferences: await getMealPreferences(mealId),
    }
}

async function SyncMealFromBackend(mealId: string): Promise<any> {
    const data = await getMealFromBackend(mealId);
    await storeMealsInDatabase(data.mealInformation);
    await handleMealPreferences(data.mealPreferences);

}

async function getMealInformation(mealId: string): Promise<MealCard> {
    const query = `
        SELECT m.meal_id           AS mealId,
               m.title,
               m.closed,
               m.fulfilled,
               m.date_time         AS dateTime,
               m.meal_type         AS mealType,
               m.notes,
               m.participant_count AS participantCount,
               m.user_preference   AS userPreference,
               m.is_cook           AS isCook
        FROM meals m
        WHERE m.meal_id = ?;
    `;
    const data = await db.getFirstAsync<MealCard>(query, mealId);
    if (!data) {
        throw new NotFoundError(FRONTEND_ERRORS.NOT_FOUND_ERROR);
    }

    data.isCook = Boolean(data.isCook);
    data.closed = Boolean(data.closed);
    data.fulfilled = Boolean(data.fulfilled);

    return data;
}

async function getMealPreferences(mealId: string): Promise<MealPreference[]|any> {
//TODO: first get all the meal preferences and then fill up the ones that dont exist, but the user is still in the group
//IN the future this should also handle the fulfilled and closed states of the meal
    const existingPreferences = await getExistingPreferences(mealId);
    const notExistingPreferences = await getNotExistingPreferencesForAllMembers(mealId);
    const allPreferences =  [...existingPreferences, ...notExistingPreferences]

    //Sort By name and preference undecided should be at the end
    allPreferences.sort((a, b) => {
        if (a.preference === DEFAULT_UNDECIDED_PREFERENCE && b.preference !== DEFAULT_UNDECIDED_PREFERENCE) return 1;
        if (b.preference === DEFAULT_UNDECIDED_PREFERENCE && a.preference !== DEFAULT_UNDECIDED_PREFERENCE) return -1;

        if (a.preference.toLowerCase() < b.preference.toLowerCase()) return -1;
        if (a.preference.toLowerCase() > b.preference.toLowerCase()) return 1;

        if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
        if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
        return 0;
    });

    allPreferences.map((preference) => {
        preference.isCook = Boolean(preference.isCook);
    })

    return allPreferences;
}

async function getExistingPreferences(mealId: string): Promise<MealPreference[]> {
    const query = `
        SELECT mp.user_id        AS userId,
               mp.meal_id        AS mealId,
               u.username        AS username,
               u.profile_picture AS profilePicture,
               mp.preference     AS preference,
               mp.is_cook        AS isCook
        FROM meal_preference mp
                 INNER JOIN users u ON mp.user_id = u.user_id
        WHERE mp.meal_id = ?;
    `;
    return await db.getAllAsync<MealPreference>(query, mealId);
}

async function getNotExistingPreferencesForAllMembers(mealId: string): Promise<MealPreference[]> {
    const query = `
        SELECT u.user_id         AS userId,
               m.meal_id         AS mealId,
               u.username        AS username,
               u.profile_picture AS profilePicture,
               'undecided'       AS preference,
               false             AS isCook
        FROM meals m
                 INNER JOIN user_groups ug
                            ON ug.group_id = m.group_id
                 INNER JOIN users u ON ug.user_id = u.user_id
                 LEFT JOIN meal_preference mp ON mp.user_id = u.user_id AND mp.meal_id = m.meal_id
        WHERE m.meal_id = ?
          AND mp.id IS NULL;
    `;
    return await db.getAllAsync<MealPreference>(query, mealId);
}


async function getMealFromBackend(mealId: string): Promise<MealSyncResponse> {
    const url = BACKEND_URL + 'sync/group/meal?mealId=' + mealId
    const timeoutPromise = timeoutPromiseFactory()

    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });

    // @ts-ignore
    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);

    await handleDefaultResponseAndHeaders(res)

    const data = await res.json()
    return {
        mealInformation: data.mealInformation,
        mealPreferences: {
            preferences: Array.isArray(data.mealPreferences.preferences) ? data.mealPreferences.preferences : [],
            deletedIds: Array.isArray(data.mealPreferences.deletedIds) ? data.mealPreferences.deletedIds : []
        }
    }
}

async function storeMealInDatabase(meal: MealCard): Promise<void> {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        await db.runAsync(`
                    INSERT INTO meals (meal_id, group_id, title, closed, fulfilled, date_time,
                                       meal_type, notes, participant_count, user_preference,
                                       is_cook, last_sync)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(meal_id) DO
                    UPDATE SET
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
            meal.mealId, meal.groupId, meal.title, meal.closed, meal.fulfilled,
            meal.dateTime, meal.mealType, meal.notes, meal.participantCount,
            meal.userPreference, Number(meal.isCook), now);
    });
}

async function handleMealPreferences(mealPreferences: MealPreferenceSyncResponse): Promise<void> {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        for (const preference of mealPreferences.preferences) {
            await db.runAsync(`
                INSERT
                OR REPLACE INTO meal_preference (id, user_group_id, meal_id, user_id, is_cook, preference, last_sync) 
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, preference.preferenceId, preference.userGroupId, preference.mealId, preference.userId, preference.isCook, preference.preference, now);
        }
        for (const deletedId of mealPreferences.deletedIds) {
            await db.runAsync(`
                DELETE
                FROM meal_preference
                WHERE id = ?;
            `, deletedId);
        }
    });
}