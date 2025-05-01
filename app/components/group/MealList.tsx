import {Box, Flex, ScrollView, Text} from "native-base";
import React from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {GetGroupMeals, MealCard as MealCardType} from "../../repo/Group";
import {MealCard} from "./MealCard";
import {MealFilterSection} from "./MealFilterSection";
import {useGroup} from "../../context/groupContext";

interface MealListProps {
    tempMeals: MealCardType[];
}

export function MealList({tempMeals}: MealListProps) {
    const text = useTexts(['noMealsInThisGroup']);
    const {group} = useGroup();

    const [meals, setMeals] = React.useState<MealCardType[]>(tempMeals);


    async function loadMeals(filterDate: Date | null) {
        if (filterDate) {
            try {
                const meals = await GetGroupMeals(group.groupId, filterDate.toISOString());
                setMeals(meals);
            } catch (e) {
                console.log(e); //TODO: Handle errors
                setMeals([]);
            }
        } else {
            setMeals(tempMeals);
        }

    }

    return (
        <Box
            pt={4}
        >
            <MealFilterSection onDateChange={loadMeals}/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                width={"100%"}
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
                            {text.noMealsInThisGroup}
                        </Text>
                    </Box>
                )}
                </Flex>
            </ScrollView>
        </Box>
    )
}
/*
<ScrollView
    contentContainerStyle={{flexGrow: 1}}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
    }
    width={"100%"}
>
*/