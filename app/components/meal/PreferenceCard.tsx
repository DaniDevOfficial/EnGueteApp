import React from 'react';
import {MealParticipants} from "../../repo/Meal";
import {Box, Flex, Pressable, Text} from "native-base";
import {PillTag} from "../UI/Pilltag";

export function PreferenceCard({mealParticipants}: {mealParticipants: MealParticipants}) {
    function handlePress() {
        console.log(123)
    }

    return (
        <Pressable onPress={handlePress} alignItems={'center'}>
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
                            {mealParticipants.username}
                        </Text>
                    </Flex>
                    <Flex alignItems={'flex-end'}>
                            <Text>{mealParticipants.isCook ? '👨‍🍳' : ''}</Text>
                            <Text>{mealParticipants.preference}</Text>
                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}

