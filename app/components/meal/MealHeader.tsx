import React from 'react';
import {Flex, Heading, Text} from "native-base";
import {MealCard} from "../../repo/Group";
import {toNormalDateTime} from "../../utility/Dates";

export function MealHeader({mealInformation}: { mealInformation: MealCard }) {
    const whenText = toNormalDateTime(mealInformation.dateTime)

    return (
        <Flex alignItems={'center'} flexDir={'column'}>
            <Heading>
                {mealInformation.title}
            </Heading>
            <Text>
                {mealInformation.mealType}
            </Text>
            <Text>
                {whenText}
            </Text>
            <Text
                fontStyle={mealInformation.notes ? "normal" : "italic"}
                color={mealInformation.notes ? "black" : "gray.500"}
            >
                {mealInformation.notes || "No additional notes."}
            </Text>

        </Flex>
    );
}

