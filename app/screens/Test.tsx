import {Button, Text} from "native-base";
import {SafeAreaView} from "react-native-safe-area-context";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {SetStateAction, useState} from "react";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {getLanguageFromAsyncStorage} from "../context/settingsContext";

import {handleInviteToken} from "../utility/DeepLinking";

export function Test() {
    const [date, setDate] = useState(new Date(1598051730000));
    const [language, setLanguage] = useState('none');
    const navigation = useNavigation();
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

    return (
        <SafeAreaView>
            <Button onPress={showDatepicker} >
                <Text>Show date picker!</Text>
            </Button>
            <Button onPress={showTimepicker} >
                <Text>Show time picker!</Text>
            </Button>
            <Button onPress={showLanguage} >
                <Text>Get Language: {language}</Text>
            </Button>
            <Text>selected: {date.toLocaleString()}</Text>
        </SafeAreaView>
    )
}