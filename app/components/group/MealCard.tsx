import React from 'react';
import {Box, Flex, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {
        // @ts-ignore
        navigation.navigate('Meal', {mealId: meal.mealId});

    }


    return (
        <Pressable onPress={handleNavigate}>
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={"70%"} my={2}>
                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Box>
                        <Text>
                            {meal.title}
                        </Text>
                    </Box>
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
