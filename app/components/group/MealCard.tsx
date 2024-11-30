import React from 'react';
import {Box, Flex, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getFancyTimeDisplay} from "../../utility/Dates";
type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {
        // @ts-ignore
        navigation.navigate('Meal', {mealId: meal.mealId});

    }

    const whenText = getFancyTimeDisplay(meal.dateTime)

    return (
        <Pressable onPress={handleNavigate}  alignItems={'center'}>
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"}  width={'90%'} my={2}>
                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Flex
                        flexDir={'column'}
                    >
                        <Text>
                            {meal.title}
                        </Text>
                        <Text>{whenText}</Text>
                    </Flex>
                    <Box>

                        <Text>
                            {meal.participantCount.toString()}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Pressable>
    );
}
