import * as SQLite from 'expo-sqlite';


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

    `);
}


export async function createDatabaseStructure() {
    await db.execAsync(`
        Take Snippet from random/scratch.sql
    `);
}
