import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, useToast} from "native-base";
import {useGroup} from "../context/groupContext";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {handleLogoutProcedure} from "../Util";
import {getMealData, MealInterface} from "../repo/Meal";
import {RefreshControl} from "react-native-gesture-handler";
import {MealHeader} from "../components/meal/MealHeader";
import {PreferenceCard} from "../components/meal/PreferenceCard";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {BackButton} from "../components/UI/BackButton";
import {PageSpinner} from "../components/UI/PageSpinner";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {showToast} from "../components/UI/Toast";
import {resetToUserScreen} from "../utility/navigation";

export function Meal() {
    const [mealInformation, setMealInformation] = useState<MealInterface | undefined>();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const text = useTexts(['error']);
    const toast = useToast();
    const getError = useErrorText();

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
            const res = await getMealData(mealId, group.groupId)
            console.log(res)
            setMealInformation(res)
            setLoading(false)
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                navigation.goBack();
                return;
            }
            setLoading(false)
            navigation.goBack();

        }
    }

    async function onRefresh() {
        setRefreshing(true)
        await getMealInformation()
        setRefreshing(false)
    }

    if (!mealInformation || loading) {
        return <PageSpinner/>
    }

    return (
        <>
            <BackButton/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <MealHeader mealInformation={mealInformation.mealInformation}/>
                {mealInformation.mealPreferences && mealInformation.mealPreferences.map((participant) => (
                    <PreferenceCard mealParticipants={participant} key={participant.userId}/>
                ))}
            </ScrollView>
        </>
    );
}

