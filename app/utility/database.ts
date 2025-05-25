import * as SQLite from 'expo-sqlite';
import * as string_decoder from "node:string_decoder";


function openDatabase() {
    return SQLite.openDatabaseSync('cache.db');
}

export const db = openDatabase();

export async function createTable() {
    console.log('Creating table');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS groups
        (
            group_id   TEXT PRIMARY KEY,
            group_name TEXT,
            user_count INTEGER last_sync TEXT DEFAULT (datetime('now')),
            created_at TEXT                   DEFAULT (datetime('now')),
            last_sync  TEXT                   DEFAULT (datetime('now'))
            );

        CREATE TABLE IF NOT EXISTS cacheStatus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cacheKey TEXT UNIQUE,
            last_sync TEXT DEFAULT (datetime('now'))
        );
    `);
    console.log('Table created');
    //Log the entire database structure
    /*
    const result = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('Database structure:', result);
     */
}

export async function checkIfCacheNeedsToBeSynced(cacheKey: string, cacheTimeSeconds: number = 20): Promise<boolean> {
    const result: {last_sync: string} | null = await db.getFirstAsync(`SELECT last_sync FROM cacheStatus WHERE cacheKey = ?`, cacheKey);
    if (!result) {
        return true; // Cache does not exist, needs to be synced
    }
    const now = new Date();
    const lastSync = new Date(result.last_sync);
    const timeDifference = now.getTime() - lastSync.getTime();
    const timeDifferenceSeconds = timeDifference / 1000;
    return timeDifferenceSeconds >= cacheTimeSeconds;
}

export async function updateSyncStatus(cacheKey: string) {
    const now = new Date().toISOString();
    await db.runAsync(`
        INSERT OR REPLACE INTO cacheStatus (cacheKey, last_sync)
        VALUES (?, ?)
    `, cacheKey, now);
}

export async function createDatabaseStructure() {
    await db.execAsync(`
        Take Snippet from random/scratch.sql
    `);
}
