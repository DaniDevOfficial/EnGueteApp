import {Button, Input, Text, useToast} from "native-base";
import {SafeAreaView} from "react-native-safe-area-context";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {SetStateAction, useEffect, useState} from "react";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {getLanguageFromAsyncStorage} from "../context/settingsContext";
import {showToast} from "../components/UI/Toast";
import {createTable, db, dropAllTables} from "../utility/database";

import {getAllGroups, SyncAllGroups} from "../repo/sync/user/AllGroups";
import {getMeals} from "../repo/sync/meal/AllMealsInGroup";

export function Test() {
    const [date, setDate] = useState(new Date(1598051730000));
    const [language, setLanguage] = useState('none');
    const [value, setValue] = useState('');
    const navigation = useNavigation();
    const toast = useToast();
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
            toast
        })
    }

    async function getGroupsSync() {
        try {
            await SyncAllGroups();
            const data = await getAllGroups();
        } catch (e) {
            console.log('error', e);
            showToast({
                title: popupTexts.maybeLater,
                description: popupTexts.groupInvite,
                status: 'error',
                toast
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

    async function loadMeals() {
        console.log(await getMeals('f15279d3-d622-475d-ad29-7d4869d10983', new Date()))
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
        <SafeAreaView>
            <Button onPress={showDatepicker}>
                <Text>Show date picker!</Text>
            </Button>
            <Button onPress={showTimepicker}>
                <Text>Show time picker!</Text>
            </Button>
            <Button onPress={showLanguage}>
                <Text>Get Language: {language}</Text>
            </Button>
            <Button onPress={showToastLocal}>
                <Text>Show Toast</Text>
            </Button>
            <Button onPress={getGroupsSync}>
                <Text>Sync Groups</Text>
            </Button>
            <Button onPress={getDataFromSqlite}>
                <Text>getDataFromSqlite</Text>
            </Button>
            <Button onPress={getDatabaseStructure}>
                <Text>get Database Structure</Text>
            </Button>

            <Button onPress={clearDatabase}>
                <Text>drop Database</Text>
            </Button>
            <Button onPress={rebuildDatabse}>
                <Text>rebuild Database</Text>
            </Button>
            <Button onPress={getAllRoles}>
                <Text>ROLES</Text>
            </Button>
            <Input
                value={value}
                onChangeText={setValue}
            >

            </Input>
            <Button onPress={addTestData}>
                Add Test Data
            </Button>
            <Button onPress={getAllMeals}>
                GetAllMeals
            </Button>
            <Button onPress={loadMeals}>
                load group meals
            </Button>
            <Button onPress={logEntireLogTable}>
                log Entire Log Table
            </Button>
            <Button onPress={addLogEntry}>
                add log Entire to Log Table
            </Button>
            <Text>selected: {date.toLocaleString()}</Text>
        </SafeAreaView>
    )
}