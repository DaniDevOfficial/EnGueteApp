import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {MealCard} from "../../repo/Group";
import {getTime, semiNormalDateTime} from "../../utility/Dates";
import {useText} from "../../utility/TextKeys/TextKeys";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "../../theme/colors";
import {PillTag} from "../Ui/Pilltag";

export function MealHeader({mealInformation}: { mealInformation: MealCard }) {
    const whenText = semiNormalDateTime(mealInformation.dateTime)
    const time = getTime(mealInformation.dateTime);
    const noNotes = useText('noNotes');

    return (
        <View className="gap-4">
            <View>
                <Text className="text-3xl font-bold text-ink">
                    {mealInformation.title}
                </Text>

                <View className="mt-3 flex-row flex-wrap items-center gap-x-4 gap-y-2">
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="calendar-outline" size={16} color={colors.ink.muted}/>
                        <Text className="text-sm text-ink-muted">{whenText}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="time-outline" size={16} color={colors.ink.muted}/>
                        <Text className="text-sm text-ink-muted">{time}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="bulb-outline" size={16} color={colors.ink.muted}/>
                        <Text className="text-sm text-ink-muted">{mealInformation.mealType}</Text>
                    </View>
                    {mealInformation.closed && <PillTag text="closed" colorScheme="closed"/>}
                    {mealInformation.fulfilled && <PillTag text="finished" colorScheme="orange"/>}
                </View>
            </View>

            <View className="max-h-[140px] rounded-2xl border border-surface-border bg-surface px-3 py-3">
                <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Notes
                </Text>
                <ScrollView nestedScrollEnabled>
                    <Text
                        className={mealInformation.notes ? 'text-base text-ink' : 'text-base italic text-ink-muted'}
                    >
                        {mealInformation.notes || noNotes}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}
