import React from 'react';
import {Box, Flex, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getFancyTimeDisplay} from "../../utility/Dates";
import {getParticipantsText} from "../../utility/TextGeneration";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText} from "../../utility/TextKeys/TextKeys";

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('Meal', { mealId: meal.mealId });
    }

    let preferenceText = meal.userPreference;
    if (preferenceText.length > 10) {
        preferenceText = preferenceText.substring(0, 10) + '...';
    }
    let mealTitle = meal.title;
    if (mealTitle.length > 10) {
        mealTitle = mealTitle.substring(0, 20) + '...';
    }


    const whenText = getFancyTimeDisplay(meal.dateTime)
    const participantsText = getParticipantsText(meal.participantCount)
    return (
        <Pressable onPress={handleNavigate} alignItems={'center'}>
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={'95%'} my={2}>
                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Flex
                        w='50%'
                        flexDir={'column'}
                    >
                        <Text>
                            {mealTitle}
                        </Text>
                        <Text>{whenText}</Text>
                    </Flex>
                    <Flex alignItems={'flex-end'}>
                        <Text>
                            {participantsText}
                        </Text>
                        <Flex flexDir={'row'}>
                            {meal.isCook && <PillTag text={'‍👨‍🍳'} />}
                            <PillTag text={mealPreferenceText(preferenceText)} colorScheme={'orange'} />
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}
