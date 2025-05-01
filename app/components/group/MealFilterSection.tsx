import {Box, Flex, IconButton, Text, Icon, Button} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {getDateDurationWeek, getFancyWeekDisplay} from "../../utility/Dates";

interface Props {
    onDateChange: (date: Date) => Promise<void>;
}

export function MealFilterSection({onDateChange}: Props) {
    const [primaryText, setPrimaryText] = useState<string>("");
    const [secondaryText, setSecondaryText] = useState<string|null>("");
    const [currentDate, setCurrentDate] = useState<Date>(getThisWeeksWednesday());

    function handleTextChange(date: Date) {
        const fancyText = getFancyWeekDisplay(date);
        if (fancyText) {
            setPrimaryText(fancyText);
            setSecondaryText(getDateDurationWeek(date))
        } else {
            setPrimaryText(getDateDurationWeek(date));
            setSecondaryText(null)
        }
    }

    async function handleDateChange(amount: number) {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + amount);
        setCurrentDate(newDate);
        await onDateChange(newDate);
    }

    useEffect(() => {
        handleTextChange(currentDate);
    }, [currentDate]);
    return (
        <Box
            background="white"
            borderRadius="full"
            shadow={2}
            padding={2}
            width="95%"
            alignSelf="center"
            height={60}
        >
            <Flex direction="row" align="center" justify="space-between">
                <IconButton
                    icon={<Icon as={MaterialIcons} name="chevron-left"/>}
                    borderRadius="full"
                    variant="ghost"
                    onPress={() => handleDateChange(-7)}
                />
                <Box alignItems={'center'} flexGrow={1}>

                    <Text fontSize="md" fontWeight="bold">
                        {primaryText}
                    </Text>
                    {secondaryText && (
                        <Text fontSize="sm" color="gray.500">
                            {secondaryText}
                        </Text>
                    )}
                </Box>
                <IconButton
                    icon={<Icon as={MaterialIcons} name="chevron-right"/>}
                    borderRadius="full"
                    variant="ghost"
                    onPress={() => handleDateChange(7)}

                />
            </Flex>
        </Box>
    );
}

function getThisWeeksWednesday() {
    const now = new Date();
    const day = now.getDay();

    const diffToWednesday = (day >= 3 ? day - 3 : -(3 - day));

    const wednesday = new Date(now);
    wednesday.setDate(now.getDate() - diffToWednesday);
    wednesday.setHours(12, 0, 0, 0);

    return wednesday;
}
