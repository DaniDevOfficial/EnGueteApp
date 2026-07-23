import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from "react-native";
import {useGroup} from "../context/groupContext";
import {useNavigation, useRoute} from "@react-navigation/native";
import {handleLogoutProcedure} from "../Util";
import {getMealData, MealInterface} from "../repo/Meal";
import {RefreshControl} from "react-native-gesture-handler";
import {MealHeader} from "../components/meal/MealHeader";
import {PreferenceCard} from "../components/meal/PreferenceCard";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {BackButton} from "../components/Ui/BackButton";
import {PageSpinner} from "../components/Ui/PageSpinner";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {showToast} from "../components/Ui/Toast";
import {resetToUserScreen} from "../utility/navigation";

export function Meal() {
    const [mealInformation, setMealInformation] = useState<MealInterface | undefined>();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const text = useTexts(['error', 'noParticipants', 'participants']);
    const getError = useErrorText();

    const route = useRoute();
    const navigation = useNavigation()
    // @ts-ignore
    const {mealId} = route.params;

    const {group} = useGroup();

    useEffect(() => {
        getMealInformation();
    }, []);

    async function getMealInformation(forceSync: boolean = false) {
        try {
            const res = await getMealData(mealId, group.groupId, forceSync)
            setMealInformation(res)
            setLoading(false)
        } catch (e) {
            showToast({
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

    const participantCount = mealInformation.mealPreferences?.length ?? 0;

    return (
        <>
            <BackButton/>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 32}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <View className="gap-6">
                    <MealHeader mealInformation={mealInformation.mealInformation}/>

                    <View className="gap-3">
                        <View className="flex-row items-end justify-between px-1">
                            <Text className="text-xl font-bold text-ink">
                                {text.participants}
                            </Text>
                            <View className="rounded-full bg-brand-orange-muted px-2.5 py-1">
                                <Text className="text-sm font-semibold text-brand-orange">
                                    {participantCount}
                                </Text>
                            </View>
                        </View>

                        {participantCount > 0 ? (
                            <View className="gap-3">
                                {mealInformation.mealPreferences.map((participant) => (
                                    <PreferenceCard
                                        mealParticipants={participant}
                                        forceRefresh={getMealInformation}
                                        key={participant.userId}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View className="items-center rounded-2xl border border-dashed border-surface-border bg-surface-muted px-4 py-10">
                                <Text className="text-center text-ink-muted">
                                    {text.noParticipants}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
