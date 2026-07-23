import React, {useState} from 'react';
import {Modal, Pressable, Switch, Text, TextInput, View} from "react-native";
import {MealPreference, saveMealPreference} from "../../repo/Meal";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {PillTag} from "../Ui/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../Ui/Toast";
import {resetToUserScreen} from "../../utility/navigation";
import {colors} from "../../theme/colors";

export function PreferenceCard({mealParticipants, forceRefresh}: {
    mealParticipants: MealPreference,
    forceRefresh: (arg0: boolean) => Promise<void>
}) {
    const getError = useErrorText();
    const text = useTexts(['error', 'errorPleaseEnterCorrectText', 'save', 'cancel', 'editPreferences', 'newPreference', 'isCook']);
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState<string>(mealPreferenceText(mealParticipants.preference));
    const [newIsCook, setNewIsCook] = useState<null | boolean>(mealParticipants.isCook);

    function handlePress() {
        setModalVisible(true);
    }

    async function handleSave() {
        if (mealParticipants.isCook === newIsCook && mealParticipants.preference === newPreference) {
            setModalVisible(false);
            return;
        }

        let preferenceParam: string | null = newPreference;
        if (mealParticipants.preference === newPreference) {
            preferenceParam = null;
        }

        let isCookParam = newIsCook;
        if (mealParticipants.isCook === newIsCook) {
            isCookParam = null;
        }

        try {
            await saveMealPreference(mealParticipants.userId, mealParticipants.mealId, preferenceParam, isCookParam);
            await forceRefresh(true)
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
                return;
            }
        }

        setModalVisible(false);
    }

    const initial = (mealParticipants.username?.trim()?.[0] || '?').toUpperCase();

    return (
        <>
            <Pressable onPress={handlePress} className="active:opacity-90">
                <View className="w-full flex-row items-center overflow-hidden rounded-2xl border border-surface-border px-4 py-3 bg-gray-100">
                    <View className="absolute bottom-0 left-0 top-0 w-1 bg-brand-orange-soft"/>
                    <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-brand-orange-muted">
                        <Text className="text-lg font-bold text-brand-orange">{initial}</Text>
                    </View>

                    <View className="flex-1">
                        <View className="mb-1 flex-row flex-wrap items-center gap-2">
                            <Text className="text-base font-bold text-ink" numberOfLines={1}>
                                {mealParticipants.username}
                            </Text>
                            {mealParticipants.isCook && <PillTag text={'👨‍🍳'} colorScheme="orange"/>}
                        </View>
                        <Text className="text-sm text-ink-muted" numberOfLines={2}>
                            {mealParticipants.preference
                                ? mealPreferenceText(mealParticipants.preference)
                                : text.errorPleaseEnterCorrectText}
                        </Text>
                    </View>
                </View>
            </Pressable>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 items-center justify-center bg-black/40 px-6"
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        className="w-full max-w-md rounded-xl bg-surface p-5"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="w-full items-center gap-2">
                            <Text className="text-center text-2xl font-bold text-ink">
                                {text.editPreferences}
                            </Text>

                            <View className="w-full gap-1">
                                <Text className="text-sm font-medium text-ink-soft">
                                    {text.newPreference}
                                </Text>
                                <TextInput
                                    value={newPreference}
                                    onChangeText={setNewPreference}
                                    placeholder={text.newPreference}
                                    className="w-full rounded-md border border-surface-border bg-surface p-3 text-base text-ink"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View className="w-full flex-row items-center justify-between py-2">
                                <Text className="text-sm font-medium text-ink-soft">
                                    {text.isCook}
                                </Text>
                                <Switch
                                    value={newIsCook ?? false}
                                    onValueChange={setNewIsCook}
                                    trackColor={{false: colors.gray[300], true: colors.brand.orangeMuted}}
                                    thumbColor={(newIsCook ?? false) ? colors.brand.orangeLight : colors.surface.muted}
                                />
                            </View>
                        </View>

                        <View className="mt-4 w-full items-center gap-2">
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-brand-orange py-3 active:opacity-60"
                                onPress={handleSave}
                            >
                                <Text className="text-base font-medium text-white">
                                    {text.save}
                                </Text>
                            </Pressable>
                            <Pressable
                                className="w-full items-center rounded-[30px] border border-brand-orange bg-surface py-3 active:opacity-60"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-base font-medium text-ink">
                                    {text.cancel}
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
