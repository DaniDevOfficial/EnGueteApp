import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";

export function showDatePicker(currentMode: "date" | "time", onChange: any = undefined, selectedDate: Date) {
    DateTimePickerAndroid.open({
        value: selectedDate,
        onChange,
        mode: currentMode,
        is24Hour: true,
    });
}
