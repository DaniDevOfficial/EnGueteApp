import {MaterialIcons} from "@expo/vector-icons";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {getDateDurationWeek, getFancyWeekDisplay} from "../../utility/Dates";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {showDatePicker} from "../Utility/DatePicker";
import {colors} from "../../theme/colors";

interface Props {
    onDateChange: (date: Date) => Promise<void>;
    setDate: Dispatch<SetStateAction<Date>>;
    defaultDate: Date;
}

export function MealFilterSection({onDateChange, setDate, defaultDate}: Props) {
    const [primaryText, setPrimaryText] = useState<string>("");
    const [secondaryText, setSecondaryText] = useState<string | null>("");
    const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
    const [loading, setLoading] = useState(false);
    const text = useTexts(['currentWeek', 'lastWeek', 'nextWeek']);

    if (currentDate !== defaultDate) {
        setCurrentDate(defaultDate); // a bit hacky because we abuse react reloading on state change but its fine
        handleDateChange(defaultDate);
    }

    function handleTextChange(date: Date) {
        const fancyText = getFancyWeekDisplay(date);
        if (fancyText) {
            setPrimaryText(text[fancyText]);
            setSecondaryText(getDateDurationWeek(date))
        } else {
            setPrimaryText(getDateDurationWeek(date));
            setSecondaryText(null)
        }
    }

    async function handleWeekChange(amount: number) {
        const newDate = addDaysToDate(currentDate, amount);
        setDate(newDate)
        await handleDateChange(newDate);
    }

    async function handleDateChange(date: Date) {
        if (loading) return;

        setLoading(true);
        try {
            const normalizedDate = getWednesdayOfWeek(date);
            setCurrentDate(normalizedDate);
            await onDateChange(normalizedDate);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleTextChange(currentDate);
    }, [currentDate]);

    return (
        <View
            className="h-[60px] w-[95%] self-center rounded-full bg-surface px-2 shadow-md"
        >
            <View className="h-full flex-row items-center justify-between">
                <Pressable
                    className="rounded-full p-2 active:opacity-60"
                    onPress={() => !loading && handleWeekChange(-7)}
                    hitSlop={8}
                >
                    <MaterialIcons name="chevron-left" size={28} color={colors.brand.orangeLight}/>
                </Pressable>

                <Pressable
                    onPress={() => !loading && showDatePicker("date", (e: any, date: Date) => {
                        handleDateChange(date)
                    }, currentDate)
                    }
                    className="h-full flex-1 items-center justify-center"
                >
                    <Text className="text-base font-bold text-ink">
                        {primaryText}
                    </Text>
                    {secondaryText && (
                        <Text className="text-sm text-ink-muted">
                            {secondaryText}
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    className="rounded-full p-2 active:opacity-60"
                    onPress={() => handleWeekChange(7)}
                    hitSlop={8}
                >
                    <MaterialIcons name="chevron-right" size={28} color={colors.brand.orangeLight}/>
                </Pressable>
            </View>
        </View>
    );
}

export function addDaysToDate(date: Date, amount: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
}

export function getWednesdayOfWeek(date: Date = new Date()) {
    const day = (date.getDay()) % 6;
    const offsetMap: Record<number, number> = {
        0: -4,
        1: 2,
        2: 1,
        3: 0,
        4: -1,
        5: -2,
        6: -3
    };
    const diffToWednesday = offsetMap[day];

    const wednesday = new Date(date);
    wednesday.setDate(date.getDate() + diffToWednesday);
    wednesday.setHours(4, 20, 6, 900);
    return wednesday;
}
