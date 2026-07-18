import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getTime, shortDate} from "../../utility/Dates";
import {PillTag} from "../Ui/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {MaterialIcons} from "@expo/vector-icons";
import {ProfilePictureList} from "../Ui/ProfilePictureList";
import {colors} from "../../theme/colors";
import arrowGoOn from '../../assets/icons/arrow-up-right.png';

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {
        // @ts-ignore
        navigation.navigate('meal', {mealId: meal.mealId});
    }

    const images = [];
    for (let i = 0; i < meal.participantCount; i++) {
        images.push('https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png')
    }

    const textsForMeal = useTexts(['open', 'closed', 'finished'])
    const whenDate = shortDate(meal.dateTime);
    const whenTimeDisplay = getTime(meal.dateTime);

    return (
        <Pressable onPress={handleNavigate} className="w-[95%] active:opacity-90">

            // w-full flex-row items-center overflow-hidden rounded-2xl border border-surface-border px-4 py-3 bg-gray-100
            <View className="relative my-2 w-full rounded-2xl overflow-hidden border border-surface-border  bg-gray-100 px-4 py-4 shadow-sm">
                <View className="absolute bottom-0 left-0 top-0 w-1 bg-brand-orange-soft z-10"/>

                {meal.fulfilled && (
                    <View className="absolute right-3 top-3">
                        <MaterialIcons name="check-circle" size={22} color={colors.status.success}/>
                    </View>
                )}

                <View className="w-full flex-row justify-between gap-3">
                    <View className="max-w-[75%] flex-1 gap-2.5">
                        <View>
                            <Text numberOfLines={1} className="text-lg font-bold text-ink">
                                {meal.title}
                            </Text>
                            <Text numberOfLines={1} className="mt-0.5 text-sm text-ink-muted">
                                {whenDate} · {whenTimeDisplay}
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap items-center gap-1">
                            {meal.isCook && <PillTag text={'👨‍🍳'} colorScheme="orange"/>}
                            <PillTag text={mealPreferenceText(meal.userPreference)} colorScheme="orange"/>
                        </View>
                    </View>

                    <View className="items-end justify-between py-0.5">
                        <PillTagBasedOnMealOpenAndFinished meal={meal} textKeys={textsForMeal}/>
                        <View className="rounded-full border-gray-200 p-2.5 border-2">
                            <Image
                                className="h-5 w-5"
                                source={arrowGoOn}
                                accessibilityLabel="open meal"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

interface PillTagBasedOnMealOpenAndFinishedProps {
    meal: MealCardType
    textKeys: { closed: string; finished: string; open: string }
}

function PillTagBasedOnMealOpenAndFinished({meal, textKeys}: PillTagBasedOnMealOpenAndFinishedProps) {
    if (meal.closed) {
        return <PillTag text={textKeys.closed} colorScheme="closed"/>
    }

    if (meal.fulfilled) {
        return <PillTag text={textKeys.finished} colorScheme="orange"/>
    }

    return <PillTag text={textKeys.open} colorScheme="success"/>
}
