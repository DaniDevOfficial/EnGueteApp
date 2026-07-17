import React, {useState} from 'react';
import {Image, Modal, Pressable, Switch, Text, TextInput, View} from "react-native";
import {MealPreference, saveMealPreference} from "../../repo/Meal";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {PillTag} from "../Ui/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../Ui/Toast";
import {resetToUserScreen} from "../../utility/navigation";

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
        setNewPreference(mealPreferenceText(mealParticipants.preference));
        setNewIsCook(mealParticipants.isCook);
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

    return (
        <>
            <Pressable onPress={handlePress}>
                <View className="rounded-md border border-orange-200 bg-gray-100 p-2 shadow-sm">
                    <View className="flex-row items-center gap-3">
                        <Image
                            source={{uri: "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png"}}
                            accessibilityLabel="Profile picture"
                            className="h-[50px] w-[50px] rounded-full"
                        />
                        <View>
                            <View className="flex-row items-center gap-3">
                                <Text className="text-xl font-bold text-black">
                                    {mealParticipants.username}
                                </Text>
                                {mealParticipants.isCook && <PillTag text={'👨‍🍳'} colorScheme={'orange'}/>}
                            </View>
                            <Text className="text-gray-600">
                                {mealParticipants.preference
                                    ? mealPreferenceText(mealParticipants.preference)
                                    : text.errorPleaseEnterCorrectText}
                            </Text>
                        </View>
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
                        className="w-full max-w-md rounded-xl bg-white p-5"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="w-full items-center gap-2">
                            <Text className="text-center text-2xl font-bold text-black">
                                {text.editPreferences}
                            </Text>

                            <View className="w-full gap-1">
                                <Text className="text-sm font-medium text-gray-700">
                                    {text.newPreference}
                                </Text>
                                <TextInput
                                    value={newPreference}
                                    onChangeText={setNewPreference}
                                    placeholder={text.newPreference}
                                    className="w-full rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View className="w-full flex-row items-center justify-between py-2">
                                <Text className="text-sm font-medium text-gray-700">
                                    {text.isCook}
                                </Text>
                                <Switch
                                    value={newIsCook ?? false}
                                    onValueChange={setNewIsCook}
                                    trackColor={{false: '#d1d5db', true: '#fdba74'}}
                                    thumbColor={(newIsCook ?? false) ? '#f97316' : '#f3f4f6'}
                                />
                            </View>
                        </View>

                        <View className="mt-4 w-full items-center gap-2">
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                                onPress={handleSave}
                            >
                                <Text className="text-base font-medium text-white">
                                    {text.save}
                                </Text>
                            </Pressable>
                            <Pressable
                                className="w-full items-center rounded-[30px] border border-app-orange bg-white py-3 active:opacity-60"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-base font-medium text-black">
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
