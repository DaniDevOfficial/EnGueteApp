import React, {useCallback, useEffect, useState} from "react";
import {RefreshControl, ScrollView, Text, View,} from "react-native";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {GetGroupMeals, MealCard as MealCardType} from "../../repo/Group";
import {MealCard} from "./MealCard";
import {addDaysToDate, getWednesdayOfWeek, MealFilterSection} from "./MealFilterSection";
import {useGroup} from "../../context/groupContext";
import {PanGestureHandler} from "react-native-gesture-handler";
import {showToast} from "../Ui/Toast";
import {NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../../utility/navigation";
import {getDayName, useSemiNormalDateTime} from "../../utility/Dates";

interface MealListProps {
    tempMeals: MealCardType[];
}

export function MealList({tempMeals}: MealListProps) {
    const text = useTexts(['error']);

    const getError = useErrorText();
    const {group} = useGroup();
    const navigation = useNavigation();

    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(getWednesdayOfWeek());
    const [meals, setMeals] = React.useState<MealCardType[]>(tempMeals);
    const [shouldReload, setShouldReload] = useState(false);

    async function loadMeals(filterDate: Date | null) {
        if (filterDate) {
            try {
                const meals = await GetGroupMeals(
                    group.groupId,
                    filterDate.toISOString(),
                );

                setMeals(meals);
            } catch (e: any) {
                showToast({
                    title: text.error,
                    description: getError(e.message),
                    status: "warning",
                });

                setMeals([]);

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure(navigation);
                    return;
                }

                if (e instanceof NotFoundError) {
                    resetToUserScreen(navigation);
                    return;
                }
            }

            setLoading(false);
        } else {
            setMeals(tempMeals);
        }

        setShouldReload(false);
    }

    async function reloadMeals() {
        setLoading(true);
        await loadMeals(date);
        setLoading(false);
    }

    useEffect(() => {
        if (!shouldReload) {
            return;
        }

        setTimeout(() => {
            loadMeals(date);
        }, 100);
    }, [shouldReload]);

    useFocusEffect(
        useCallback(() => {
            setShouldReload(true);
        }, []),
    );

    useEffect(() => {
        loadMeals(date);
    }, []);

    return (
        <PanGestureHandler
            onEnded={({nativeEvent}) => {
                if (nativeEvent.translationX < -50) {
                    setDate(addDaysToDate(date, 7));
                } else if (nativeEvent.translationX > 50) {
                    setDate(addDaysToDate(date, -7));
                }
            }}
        >
            <View className="pt-4">
                <MealFilterSection
                    onDateChange={loadMeals}
                    setDate={setDate}
                    defaultDate={date}
                />

                <ScrollView
                    className="w-full min-h-full"
                    contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={reloadMeals}
                        />
                    }
                >
                    <View className="flex flex-col items-center justify-center w-full pb-10">
                        <List meals={meals}/>
                    </View>
                </ScrollView>
            </View>
        </PanGestureHandler>
    );
}

function List({meals = []}: { meals: MealCardType[] }) {
    let lastDayName = "";
    const semiNormalDateTime = useSemiNormalDateTime();
    const weekdayNames = useTexts([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]);

    const text = useTexts(['noMealsInThisWeek']);

    if (!meals.length) {
        return (
            <View className="py-10">
                <Text>{text.noMealsInThisWeek}</Text>
            </View>
        );
    }

    return (
        <>
            {meals.map((meal) => {

                const dayOfWeek = new Date(meal.dateTime).getDay();
                const currentDayName =
                    weekdayNames[getDayName(dayOfWeek)] || "";
                const showDay = currentDayName !== lastDayName;


                if (showDay) {
                    lastDayName = currentDayName;
                }

                return (
                    <React.Fragment key={meal.mealId}>
                        {showDay && (
                            <View className="items-center justify-center">
                                <Text className="mt-4 font-bold">
                                    📅 {semiNormalDateTime(meal.dateTime)}
                                </Text>
                            </View>
                        )}

                        <MealCard meal={meal}/>
                    </React.Fragment>
                );
            })}
        </>
    );
}