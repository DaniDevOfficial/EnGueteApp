import * as SQLite from 'expo-sqlite';


function openDatabase() {
    return SQLite.openDatabaseSync('cache.db');
}

export const db = openDatabase();

export async function createTable() {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS groups
        (
            group_id   TEXT PRIMARY KEY NOT NULL,
            group_name TEXT NOT NULL,
            user_count INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            last_sync  TEXT DEFAULT (datetime('now'))
            );
        CREATE TABLE IF NOT EXISTS cacheStatus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cacheKey TEXT UNIQUE,
            last_sync TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT,
            profile_picture TEXT,
            last_sync TEXT DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS user_group_roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            user_id TEXT NOT NULL,
            group_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
            UNIQUE(user_id, group_id, role)
        );  
        CREATE TABLE IF NOT EXISTS user_groups (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            group_id TEXT NOT NULL,
            joined_at TEXT NOT NULL,
            last_sync TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
            UNIQUE(user_id, group_id)
        );
        
        CREATE TABLE IF NOT EXISTS meals (
            meal_id TEXT PRIMARY KEY,
            group_id TEXT NOT NULL,
            title TEXT NOT NULL,
            closed Integer NOT NULL DEFAULT 0,
            fulfilled Integer NOT NULL DEFAULT 0,
            date_time TEXT DEFAULT (datetime('now')),
            meal_type TEXT NOT NULL,
            notes  TEXT NOT NULL,
            participant_count TEXT NOT NULL,
            user_preference TEXT NOT NULL,
            is_cook INTEGER NOT NULL,
            last_sync TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE

        );
        
        CREATE TABLE IF NOT EXISTS meal_preference (
            id TEXT PRIMARY KEY,
            preference TEXT NOT NULL,
            is_cook INTEGER NOT NULL,
            meal_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_group_id TEXT NOT NULL,
            last_sync  TEXT DEFAULT (datetime('now')),

            FOREIGN KEY (meal_id) REFERENCES meals(meal_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (user_group_id) REFERENCES user_groups(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_level TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT DEFAULT (datetime('now'))
        );
    `); //TODO add user_groups table and reference with the roles table for simple deletion later on
    //Log the entire database structure
    return;
    const result = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('Database structure:', result);
}

export async function dropAllTables() {
    try {


        await db.execAsync(`
            DROP TABLE IF EXISTS cacheStatus;
            DROP TABLE IF EXISTS test;
            DROP TABLE IF EXISTS log;

            DROP TABLE IF EXISTS user_group_roles;
            DROP TABLE IF EXISTS meals;

            DROP TABLE IF EXISTS groups;
            DROP TABLE IF EXISTS users;
        `);
        console.log('All tables dropped');
    } catch (error) {
        console.log('Error dropping tables:', error);
    }
}

export async function clearDatabase() {
    try { //TODO: clean this up
        await db.execAsync(`
            DELETE
            FROM groups;
            DELETE
            FROM cacheStatus;
            DELETE
            FROM log;
            DELETE
            FROM users;
            DELETE
            FROM user_group_roles;
        `);
        console.log('Database cleared');
    } catch (error) {
        console.log('Error clearing database:', error);
    }
}

export async function needsToBeSynced(cacheKey: string, cacheTimeSeconds: number = 20): Promise<boolean> {
    const result: { last_sync: string } | null = await db.getFirstAsync(`SELECT last_sync
                                                                         FROM cacheStatus
                                                                         WHERE cacheKey = ?`, cacheKey);
    if (result === null) {
        console.log(`CacheKey ${cacheKey} does not exist, needs to be synced`);
        return true; // Cache does not exist, needs to be synced
    }
    const now = new Date();
    const lastSync = new Date(result.last_sync);
    const timeDifference = now.getTime() - lastSync.getTime();
    const timeDifferenceSeconds = timeDifference / 1000;
    if (false) {

        console.log({
            cacheKey,
            // @ts-ignore
            lastSync: result.last_sync,
            now: now.toISOString(),
            timeDifferenceSeconds,
            cacheTimeSeconds
        });
    }
    return timeDifferenceSeconds >= cacheTimeSeconds;
}

export async function updateSyncStatus(cacheKey: string) {
    const now = new Date().toISOString();
    await db.runAsync(`
        INSERT
        OR REPLACE INTO cacheStatus (cacheKey, last_sync)
        VALUES (?, ?)
    `, cacheKey, now);
}