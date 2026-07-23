import {SafeAreaView} from "react-native-safe-area-context";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {SetStateAction, useEffect, useState} from "react";
import {Pressable, ScrollView, Text, TextInput} from "react-native";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {getLanguageFromAsyncStorage} from "../context/settingsContext";
import {showToast} from "../components/Ui/Toast";
import {createTable, db, dropAllTables} from "../utility/database";
import {getAllGroups, SyncAllGroups} from "../repo/sync/user/AllGroups";

function DevButton({label, onPress}: { label: string; onPress: () => void }) {
    return (
        <Pressable
            className="mb-2 w-full items-center rounded-xl bg-app-orange px-4 py-3 active:opacity-60"
            onPress={onPress}
        >
            <Text className="text-center text-sm font-medium text-white">{label}</Text>
        </Pressable>
    );
}

export function Test() {
    const [date, setDate] = useState(new Date(1598051730000));
    const [language, setLanguage] = useState('none');
    const [value, setValue] = useState('');
    const onChange = (event: any, selectedDate: SetStateAction<Date>) => {
        setDate(selectedDate);
    };
    const [popupTexts] = useState(useTexts(['maybeLater', 'joinGroup', 'youWereInvited', 'groupInvite']));

    const showMode = (currentMode: string) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    async function showLanguage() {
        setLanguage(await getLanguageFromAsyncStorage());
    }

    function showToastLocal() {
        showToast({
            title: popupTexts.maybeLater,
            description: popupTexts.joinGroup,
            status: 'info',
        })
    }

    async function getGroupsSync() {
        try {
            await SyncAllGroups();
            await getAllGroups();
        } catch (e) {
            console.log('error', e);
            showToast({
                title: popupTexts.maybeLater,
                description: popupTexts.groupInvite,
                status: 'error',
            })
        }
    }

    async function getDataFromSqlite() {
        console.log(123)
        const allRows = await db.getAllAsync('SELECT * FROM cacheStatus');
        console.log(allRows);
    }

    async function addTestData() {
        await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', value, 1);
    }

    async function getDatabaseStructure() {
        try {
            const tables = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type="table"');
            console.log('Database structure:', tables);
        } catch (e) {
            console.error('Error getting database structure:', e);
        }
    }

    async function clearDatabase() {
        try {
            await dropAllTables();
            console.log('Database strucutre droppped successfully');
        } catch (e) {
            console.error('Error dropping database:', e);
        }
    }

    async function rebuildDatabse() {
        try {
            await createTable();
            console.log('Database structure rebuilt successfully');
        } catch (e) {
            console.error('Error rebuilding databse:', e);
        }
    }

    async function getAllRoles() {
        const roles = await db.getAllAsync('SELECT * FROM user_group_roles');
        console.log('Roles:', roles);
    }

    async function getAllMeals() {
        const tmp = await db.getAllAsync(`
    SELECT * FROM meals
    `)
        console.log({tmp})
    }

    async function getGroups() {
        const user_groups = await db.getAllAsync('SELECT * FROM user_groups')
        const groups = await db.getAllAsync('SELECT * FROM groups')
        console.log({user_groups, groups})
    }

    async function logEntireLogTable() {
        const logEntries = await db.getAllAsync('SELECT * FROM log');
        console.log('Log Entries:', logEntries);
    }

    async function addLogEntry() {
        const now = new Date().toISOString();
        await db.runAsync(`
            INSERT INTO log (log_level, message, timestamp)
            VALUES ('INFO', 'Test log entry', ?);
        `, now);
    }

    useEffect(() => {
        createTable();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 40}}>
                <Text className="mb-4 text-xl font-bold text-black">Dev tools</Text>

                <DevButton label="Show date picker" onPress={showDatepicker}/>
                <DevButton label="Show time picker" onPress={showTimepicker}/>
                <DevButton label={`Get Language: ${language}`} onPress={showLanguage}/>
                <DevButton label="Show Toast" onPress={showToastLocal}/>
                <DevButton label="Sync Groups" onPress={getGroupsSync}/>
                <DevButton label="getDataFromSqlite" onPress={getDataFromSqlite}/>
                <DevButton label="get Database Structure" onPress={getDatabaseStructure}/>
                <DevButton label="drop Database" onPress={clearDatabase}/>
                <DevButton label="rebuild Database" onPress={rebuildDatabse}/>
                <DevButton label="ROLES" onPress={getAllRoles}/>

                <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder="Test value"
                    className="mb-2 rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                />

                <DevButton label="Add Test Data" onPress={addTestData}/>
                <DevButton label="GetAllMeals" onPress={getAllMeals}/>
                <DevButton label="load groups" onPress={getGroups}/>
                <DevButton label="log Entire Log Table" onPress={logEntireLogTable}/>
                <DevButton label="add log Entire to Log Table" onPress={addLogEntry}/>

                <Text className="mt-2 text-sm text-gray-600">
                    selected: {date.toLocaleString()}
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}
