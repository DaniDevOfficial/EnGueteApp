import {Box, Flex, Icon, IconButton, Pressable, Text} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {getDateDurationWeek, getFancyWeekDisplay} from "../../utility/Dates";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {showDatePicker} from "../Utility/DatePicker";

interface Props {
    onDateChange: (date: Date) => Promise<void>;
}

export function MealFilterSection({onDateChange}: Props) {
    const [primaryText, setPrimaryText] = useState<string>("");
    const [secondaryText, setSecondaryText] = useState<string | null>("");
    const [currentDate, setCurrentDate] = useState<Date>(getWednesdayOfWeek());
    const text = useTexts(['thisWeek', 'lastWeek', 'nextWeek']);

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

        await handleDateChange(newDate);
    }

    async function handleDateChange(date: Date) {
        date = getWednesdayOfWeek(date)
        setCurrentDate(date);
        await onDateChange(date);
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
                    onPress={() => handleWeekChange(-7)}
                />
                <Pressable
                    onPress={() =>
                        showDatePicker("date", (e: any, date: Date) => {
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

function getWednesdayOfWeek(date: Date = new Date()) {
    const day = date.getDay();

    const diffToWednesday = (day >= 3 ? day - 3 : -(3 - day));

    const wednesday = new Date(date);
    wednesday.setDate(date.getDate() - diffToWednesday);
    wednesday.setHours(4, 20, 6, 900);

    return wednesday;
}
