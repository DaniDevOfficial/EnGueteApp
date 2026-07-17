import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getTime, shortDate} from "../../utility/Dates";
import {PillTag} from "../Ui/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {MaterialIcons} from "@expo/vector-icons";
import {ProfilePictureList} from "../Ui/ProfilePictureList";

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
        <Pressable onPress={handleNavigate} className="w-[95%]">
            <View
                className={`relative my-2 w-full items-center rounded-md p-4 shadow-md ${meal.closed ? 'bg-gray-300' : 'bg-gray-200'}`}
            >
                {meal.fulfilled && (
                    <View className="absolute -right-2.5 -top-2.5">
                        <MaterialIcons name="check-circle" size={28} color="#22c55e"/>
                    </View>
                )}
                <View className="w-full flex-row justify-between gap-4">
                    <View className="w-[45%] gap-5">
                        <View>
                            <Text numberOfLines={1} className="text-xl font-bold text-black">
                                {meal.title}
                            </Text>
                            <View className="flex-row gap-2">
                                <Text numberOfLines={1} className="text-black">{whenDate}</Text>
                                <Text className="text-black">|</Text>
                                <Text numberOfLines={1} className="text-black">{whenTimeDisplay}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            {meal.isCook && <PillTag text={'‍👨‍🍳'}/>}
                            <PillTag text={mealPreferenceText(meal.userPreference)} colorScheme={'orange'}/>
                        </View>
                    </View>
                    <View className="w-[45%] items-end justify-between">
                        <PillTagBasedOnMealOpenAndFinished meal={meal} textKeys={textsForMeal}/>
                        <ProfilePictureList
                            profilePictures={images}
                            totalAmount={meal.participantCount}
                        />
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
        return (<PillTag text={textKeys.closed} colorScheme={'blueGray'}/>)
    }

    if (meal.fulfilled) {
        return (
            <PillTag text={textKeys.finished} colorScheme={'orange'}/>
        )
    }

    return (
        <PillTag text={textKeys.open} colorScheme={'green'}/>
    )
}
