import {Box, Flex, HStack, ScrollView, Text, useToast, VStack} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {GetGroupMeals, MealCard as MealCardType} from "../../repo/Group";
import {MealCard} from "./MealCard";
import {addDaysToDate, getWednesdayOfWeek, MealFilterSection} from "./MealFilterSection";
import {useGroup} from "../../context/groupContext";
import {PanGestureHandler, RefreshControl, State} from "react-native-gesture-handler";
import {showToast} from "../UI/Toast";
import {NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../../utility/navigation";
import {getDayName, semiNormalDateTime} from "../../utility/Dates";

interface MealListProps {
    tempMeals: MealCardType[];
}

export function MealList({tempMeals}: MealListProps) {
    const text = useTexts(['error']);

    const weekdayNames = useTexts(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

    const toast = useToast();
    const getError = useErrorText();
    const {group, setGroup} = useGroup();
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(getWednesdayOfWeek());
    const [meals, setMeals] = React.useState<MealCardType[]>(tempMeals);
    const [shouldReload, setShouldReload] = useState(false);

    async function loadMeals(filterDate: Date | null) {
        if (filterDate) {
            try {
                const meals = await GetGroupMeals(group.groupId, filterDate.toISOString());
                setMeals(meals);
            } catch (e) {
                showToast({
                    toast,
                    title: text.error,
                    description: getError(e.message),
                    status: "warning",
                })
                setMeals([]);

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure(navigation)
                    return;
                }

                if (e instanceof NotFoundError) {
                    resetToUserScreen(navigation)
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
        await loadMeals(date) //TODO: maybe skeletons or something
        setLoading(false);
    }


    useEffect(() => {
        if (!shouldReload) {
            return;
        }
        setTimeout(() => {
            loadMeals(date)
        }, 100) // this is because the animation is not finished yet and a statechange will cause a re-render. it's a bit hacky but it works
        //TODO: find a better way to do this

    }, [shouldReload]);

    useFocusEffect(
        useCallback(() => {
            setShouldReload(true);
        }, [])
    );

    useEffect(() => {
        loadMeals(date);
    }, []);



    return (
        <PanGestureHandler
            onEnded={({nativeEvent}) => {
                // when the user spam swipes there might be some issues, because meals will be loaded wrong but for now we ignore it

                if (nativeEvent.translationX < -50) {
                    setDate(addDaysToDate(date, 7))
                } else if (nativeEvent.translationX > 50) {
                    setDate(addDaysToDate(date, -7));
                }
            }}
        >
            <Box
                pt={4}
            >
                <MealFilterSection onDateChange={loadMeals} setDate={setDate} defaultDate={date}/>

                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    width={"100%"}
                    minH={"100%"}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={reloadMeals}/>
                    }
                >
                    <Flex
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        width={"100%"}
                        paddingBottom={10}
                    >

                        <List meals={meals}/>
                    </Flex>
                </ScrollView>

            </Box>
        </PanGestureHandler>
    )
}


function List({meals = []}: { meals: MealCardType[] }) {
    let lastDayName = '';
    const weekdayNames = useTexts(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    const text = useTexts(['noMealsInThisWeek']);

    if (!meals.length) {
        return (
            <Box py={10}>
                <Text>{text.noMealsInThisWeek}</Text>
            </Box>
        );
    }

    return (
        <>
            {meals.map((meal) => {
                const dayOfWeek = new Date(meal.dateTime).getDay();
                const currentDayName = weekdayNames[getDayName(dayOfWeek)] || '';

                const showDay = currentDayName !== lastDayName;
                if (showDay) lastDayName = currentDayName;
                return (
                    <React.Fragment key={meal.mealId}>
                        {showDay && (
                            <VStack
                                justifyContent={'center'}
                                alignItems={'center'}
                            >

                                <Text fontWeight="bold" mt={4}>
                                    📅 {semiNormalDateTime(meal.dateTime)}
                                </Text>
                            </VStack>

                        )}
                        <MealCard meal={meal}/>
                    </React.Fragment>
                );
            })}
        </>
    );
}