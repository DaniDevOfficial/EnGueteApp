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
        navigation.navigate('meal', { mealId: meal.mealId });
    }
    
    const whenText = getFancyTimeDisplay(meal.dateTime)
    const participantsText = getParticipantsText(meal.participantCount)
    return (
        <Pressable onPress={handleNavigate} alignItems={'center'} width={'100%'}>
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
                        <Text isTruncated>
                            {meal.title}
                        </Text>
                        <Text isTruncated>{whenText}</Text>
                    </Flex>
                    <Flex alignItems={'flex-end'} w={'50%'}>
                        <Text isTruncated>
                            {participantsText}
                        </Text>
                        <Flex flexDir={'row'}>
                            {meal.isCook && <PillTag text={'‍👨‍🍳'} />}
                            <PillTag text={mealPreferenceText(meal.userPreference)} colorScheme={'orange'} />
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}
