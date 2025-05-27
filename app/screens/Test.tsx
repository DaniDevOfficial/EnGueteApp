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
        const allRows = await db.getAllAsync('SELECT * FROM groups');
        console.log('allRows', allRows);
        await dropAllTables()

    }
    async function addTestData() {
        await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', value, 1);
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
                <Text>SQLite</Text>
            </Button>
            <Input
                value={value}
                onChangeText={setValue}
            >

            </Input>
            <Button onPress={addTestData}>
            Add Test  Data
            </Button>
            <Text>selected: {date.toLocaleString()}</Text>
        </SafeAreaView>
    )
}