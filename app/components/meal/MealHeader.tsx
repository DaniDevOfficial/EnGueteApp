import React from 'react';
import {Box, Flex, Heading, HStack, Icon, ScrollView, Text, VStack} from "native-base";
import {MealCard} from "../../repo/Group";
import {getTime, semiNormalDateTime, toNormalDateTime} from "../../utility/Dates";
import {useText} from "../../utility/TextKeys/TextKeys";
import {Ionicons} from "@expo/vector-icons";

export function MealHeader({mealInformation}: { mealInformation: MealCard }) {
    const whenText = semiNormalDateTime(mealInformation.dateTime)
    const time = getTime(mealInformation.dateTime);

    return (
        <VStack paddingTop={5} space={2}>

            <Heading>
                {mealInformation.title}
            </Heading>

            <HStack
                space={5}
            >

                <HStack space={2}>
                    <Icon
                        as={Ionicons}
                        name={'calendar-outline'}
                        size={5}
                    />
                    <Text>
                        {whenText}
                    </Text>
                </HStack>

                <HStack space={2}>
                    <Icon
                        as={Ionicons}
                        name={'time-outline'}
                        size={5}
                    />
                    <Text>
                        {time}
                    </Text>
                </HStack>
            </HStack>

            <HStack space={2}>
                <Icon
                    as={Ionicons}
                    name={'bulb-outline'}
                    size={5}
                />
                <Text>
                    {mealInformation.mealType}
                </Text>
            </HStack>


            <Box
                p={2}
                backgroundColor="coolGray.200"
                borderRadius={5}
                maxHeight={150}
            >
                <ScrollView>
                    <Text
                        fontStyle={mealInformation.notes ? "normal" : "italic"}
                        color={mealInformation.notes ? "black" : "gray.500"}
                    >
                        {mealInformation.notes || useText('noNotes')}
                    </Text>
                </ScrollView>
            </Box>


        </VStack>
    );
}

