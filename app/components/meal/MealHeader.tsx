import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {MealCard} from "../../repo/Group";
import {getTime, semiNormalDateTime} from "../../utility/Dates";
import {useText} from "../../utility/TextKeys/TextKeys";
import {Ionicons} from "@expo/vector-icons";

export function MealHeader({mealInformation}: { mealInformation: MealCard }) {
    const whenText = semiNormalDateTime(mealInformation.dateTime)
    const time = getTime(mealInformation.dateTime);
    const noNotes = useText('noNotes');

    return (
        <View className="gap-2 pt-5">
            <Text className="text-2xl font-bold text-black">
                {mealInformation.title}
            </Text>

            <View className="flex-row gap-5">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar-outline" size={20} color="#000000"/>
                    <Text className="text-black">
                        {whenText}
                    </Text>
                </View>

                <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={20} color="#000000"/>
                    <Text className="text-black">
                        {time}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <Ionicons name="bulb-outline" size={20} color="#000000"/>
                <Text className="text-black">
                    {mealInformation.mealType}
                </Text>
            </View>

            <View className="max-h-[150px] rounded-[5px] bg-gray-200 p-2">
                <ScrollView nestedScrollEnabled>
                    <Text
                        className={mealInformation.notes ? 'text-black' : 'italic text-gray-500'}
                    >
                        {mealInformation.notes || noNotes}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}
