import {Box, Flex, ScrollView, Text} from "native-base";
import React from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {GetGroupMeals, MealCard as MealCardType} from "../../repo/Group";
import {MealCard} from "./MealCard";
import {MealFilterSection} from "./MealFilterSection";
import {useGroup} from "../../context/groupContext";
import {RefreshControl} from "react-native-gesture-handler";

interface MealListProps {
    tempMeals: MealCardType[];
}

export function MealList({tempMeals}: MealListProps) {
    const text = useTexts(['noMealsInThisWeek']);
    const {group} = useGroup();
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [meals, setMeals] = React.useState<MealCardType[]>(tempMeals);


    async function loadMeals(filterDate: Date | null) {
        if (filterDate) {
            setLoading(true);
            setDate(filterDate);
            try {
                const meals = await GetGroupMeals(group.groupId, filterDate.toISOString());
                setMeals(meals);
            } catch (e) {
                console.log(e); //TODO: Handle errors
                setMeals([]);
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