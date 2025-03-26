import React from 'react';
import {Box, Flex, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getFancyTimeDisplay} from "../../utility/Dates";
import {getParticipantsText} from "../../utility/TextGeneration";
import {PillTag} from "../UI/Pilltag";

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('Meal', { mealId: meal.mealId });
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
                        w='60%'
                        flexDir={'column'}
                    >
                        <Text>
                            {meal.title}
                        </Text>
                        <Text>{whenText}</Text>
                    </Flex>
                    <Flex alignItems={'flex-end'}>
                        <Text>
                            {participantsText}
                        </Text>
                        <Flex flexDir={'row'}>
                            {meal.isCook && <PillTag text={'test'} />}
                            <PillTag text={meal.userPreference} colorScheme={'orange'} />
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}
