import React, {useEffect, useState} from 'react';
import {Box, ScrollView, Spinner} from "native-base";
import {useGroup} from "../context/groupContext";
import {useNavigation, useRoute} from "@react-navigation/native";
import {handleLogoutProcedure} from "../Util";
import {getMealData, MealInterface} from "../repo/Meal";
import {RefreshControl} from "react-native-gesture-handler";
import {MealHeader} from "../components/meal/MealHeader";
import {PreferenceCard} from "../components/meal/PreferenceCard";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {BackButton} from "../components/UI/BackButton";

export function Meal() {
    const [mealInformation, setMealInformation] = useState<MealInterface | undefined>();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const route = useRoute();
    const navigation = useNavigation()
    // @ts-ignore
    const {mealId} = route.params;

    const {group} = useGroup();

    useEffect(() => {
        getMealInformation();
    }, []);

    async function getMealInformation() {
        try {
            const res = await getMealData(mealId)
            setMealInformation(res)
            setLoading(false)
        } catch (e) {
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }

            if (e instanceof ForbiddenError) {
                console.log('This action is forbidden for this user')
                //TODO: toast
            }


            setLoading(false)
            navigation.goBack();
            console.log(e.message)
        }
    }


    async function onRefresh() {
        setRefreshing(true)
        await getMealInformation()
        setRefreshing(false)
    }

    if (!mealInformation || loading) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" color="emerald.500"/>
            </Box>
        )
    }

    return (
        <>
            <BackButton />
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <MealHeader mealInformation={mealInformation.mealInformation}/>
                {mealInformation.mealParticipants && mealInformation.mealParticipants.map((participant) => (
                    <PreferenceCard mealParticipants={participant} key={participant.userId}/>
                ))}
            </ScrollView>
        </>
    );
}

