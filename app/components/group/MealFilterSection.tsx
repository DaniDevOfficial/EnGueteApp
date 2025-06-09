import {Box, Flex, Icon, IconButton, Pressable, Text} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getDateDurationWeek, getFancyWeekDisplay} from "../../utility/Dates";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {showDatePicker} from "../Utility/DatePicker";

interface Props {
    onDateChange: (date: Date) => Promise<void>;
    setDate: Dispatch<SetStateAction<Date>>;
}

export function MealFilterSection({onDateChange, setDate}: Props) {
    const [primaryText, setPrimaryText] = useState<string>("");
    const [secondaryText, setSecondaryText] = useState<string | null>("");
    const [currentDate, setCurrentDate] = useState<Date>(getWednesdayOfWeek());
    const [loading, setLoading] = useState(false);
    const text = useTexts(['currentWeek', 'lastWeek', 'nextWeek']);

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
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + amount);
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
        <Box
            background="white"
            borderRadius="full"
            shadow={2}
            paddingX={2}
            width="95%"
            alignSelf="center"
            height={60}
        >
            <Flex
                direction="row"
                align="center"
                justify="space-between"
                height="100%"
            >
                <IconButton
                    icon={<Icon as={MaterialIcons} name="chevron-left"/>}
                    borderRadius="full"
                    variant="ghost"
                    onPress={() => !loading && handleWeekChange(-7)}
                />
                <Pressable
                    onPress={() => !loading && showDatePicker("date", (e: any, date: Date) => {
                        handleDateChange(date)
                    }, currentDate)
                    }
                    alignItems="center"
                    flexGrow={1}
                    height="100%"
                    justifyContent="center"
                >
                    <Text fontSize="md" fontWeight="bold">
                        {primaryText}
                    </Text>
                    {secondaryText && (
                        <Text fontSize="sm" color="gray.500">
                            {secondaryText}
                        </Text>
                    )}
                </Pressable>
                <IconButton
                    icon={<Icon as={MaterialIcons} name="chevron-right"/>}
                    borderRadius="full"
                    variant="ghost"
                    onPress={() => handleWeekChange(7)}
                />
            </Flex>
        </Box>

    );
}

export function getWednesdayOfWeek(date: Date = new Date()) {
    const day = (date.getDay()) % 6;
    const offsetMap: Record<number, number> = {
        0: -4,
        1:  2,
        2:  1,
        3:  0,
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
