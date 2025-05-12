import {Box, Flex, ScrollView, Text, useToast} from "native-base";
import React from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {GetGroupMeals, MealCard as MealCardType} from "../../repo/Group";
import {MealCard} from "./MealCard";
import {MealFilterSection} from "./MealFilterSection";
import {useGroup} from "../../context/groupContext";
import {RefreshControl} from "react-native-gesture-handler";
import {showToast} from "../UI/Toast";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {useNavigation} from "@react-navigation/native";
import {NOT_FOUND} from "../../utility/HttpResponseCodes";
import {resetToUserScreen} from "../../utility/navigation";

interface MealListProps {
    tempMeals: MealCardType[];
}

export function MealList({tempMeals}: MealListProps) {
    const text = useTexts(['noMealsInThisWeek', 'error']);
    const toast = useToast();
    const getError = useErrorText();
    const {group, setGroup} = useGroup();
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(group.filterDate);
    const [meals, setMeals] = React.useState<MealCardType[]>(tempMeals);


    async function loadMeals(filterDate: Date | null) {
        if (filterDate) {
            setLoading(true);
            setDate(filterDate);
            setGroup({...group, filterDate: filterDate});
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

    }

    async function reloadMeals() {
        setLoading(true);
        await loadMeals(date) //TODO: maybe skeletons or something
        setLoading(false);
    }


    return (
        <Box
            pt={4}
        >
            <MealFilterSection onDateChange={loadMeals}/>
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

                    {meals && meals.length > 0 ? meals.map((meal) => (
                            <MealCard meal={meal} key={meal.mealId}/>
                        )
                    ) : (
                        <Box py={10}>
                            <Text>
                                {text.noMealsInThisWeek}
                            </Text>
                        </Box>
                    )}
                </Flex>
            </ScrollView>
        </Box>
    )
}