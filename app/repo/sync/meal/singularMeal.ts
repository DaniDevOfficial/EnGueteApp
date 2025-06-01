// @ts-ignore
import {BACKEND_URL} from '@env';
import {FRONTEND_ERRORS, NotFoundError, TimeoutError} from "../../../utility/Errors";
import {GetGroupMemberList, MealCard} from "../../Group";
import {MealInterface, MealPreference} from "../../Meal";
import {db} from "../../../utility/database";

export const singularMealCacheKey = 'singularMeal_';

export async function TryAndSyncSingularMeal(mealId: string, groupId: string): Promise<MealInterface> {
    try {
        await SyncMealFromBackend(mealId);
        await GetGroupMemberList(mealId); // This is so we are up to date with the group members, so no unsynced participants are stored
        return getMeal(groupId);
    } catch (error) {
        if (error instanceof TimeoutError) {
            return getMeal(mealId);
        }
        throw error;
    }
}

interface PreferenceSyncResponse {
    preferenceId: string;
    userGroupsId: string;
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
    await storeMealInDatabase(data.mealInformation);
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
    return data;
}

async function getMealPreferences(mealId: string): Promise<MealPreference[]|any> {
//TODO: first get all the meal preferences and then fill up the ones that dont exist, but the user is still in the group
//IN the future this should also handle the fulfilled and closed states of the meal
    const existingPreferences = await getExistingPreferences(mealId);
    const notExistingPreferences = await getNotExistingPreferencesForAllMembers(mealId);
    console.log({
        existingPreferences,
        notExistingPreferences
    })
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
    return await db.getAllAsync<MealPreference[]>(query, mealId);
}


async function getMealFromBackend(mealId: string): Promise<MealSyncResponse> {

}

async function storeMealInDatabase(meal: any): Promise<void> {

}

async function handleMealPreferences(mealPreferences: MealPreferenceSyncResponse): Promise<void> {
    await db.withTransactionAsync(async () => {
        const now = new Date().toISOString();
        for (const preference of mealPreferences.preferences) {
            await db.runAsync(`
                INSERT
                OR REPLACE INTO meal_preferences (id, user_group_id, meal_id, user_id, is_cook, preference, lastSync) 
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, preference.preferenceId, preference.userGroupsId, preference.mealId, preference.userId, preference.isCook, preference.preference, now);
        }
        for (const deletedId of mealPreferences.deletedIds) {
            await db.runAsync(`
                DELETE
                FROM meal_preferences
                WHERE id = ?;
            `, deletedId);
        }
    });
}