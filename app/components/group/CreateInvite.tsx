import React, {useState} from "react";
import {ActivityIndicator, Modal, Pressable, Text, TextInput, View} from "react-native";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {getSwissDateTimeDisplay} from "../../utility/Dates";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CreateInviteToken, CreateInviteTokenRequest} from "../../repo/group/Invites";
import {showToast} from "../Ui/Toast";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {resetToUserScreen} from "../../utility/navigation";
import {useNavigation} from "@react-navigation/native";

interface CreateInviteProps {
    groupId: string;
    onSuccess: () => Promise<void>;
}

export function CreateInvite({groupId, onSuccess}: CreateInviteProps) {
    const text = useTexts(['createInvite', 'whenTheInviteWillBeInvalid', 'cancel']);
    const cancelLabel = useText('cancel');
    const navigation = useNavigation();
    const getError = useErrorText();

    const [expiresAt, setExpiresAt] = useState<string>();
    const [expiresAtDate, setExpiresAtDate] = useState<Date>(new Date);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function onChangeDatePicker(event: any, selectedDate?: Date) {
        if (!selectedDate) return;

        setExpiresAtDate(selectedDate);
        setExpiresAt(getSwissDateTimeDisplay(selectedDate));
    }

    function showMode(currentMode: "date" | "time", onChange = onChangeDatePicker, selectedDate: Date) {
        DateTimePickerAndroid.open({
            value: selectedDate,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    }

    function showDatepicker() {
        showMode("date", (event, selectedDate) => {
            if (selectedDate) {
                onChangeDatePicker(event, selectedDate);
                showMode("time", onChangeDatePicker, selectedDate);
            }
        }, expiresAtDate);
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const data: CreateInviteTokenRequest = {
                groupId: groupId,
                expiresAt: expiresAtDate.toISOString(),
            }
            await CreateInviteToken(data);
            await onSuccess();
            setModalVisible(false)
        } catch (e) {
            showToast({
                title: text.createInvite,
                description: getError(e.message),
                status: "error",
            });

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
            }
        }
        setIsSaving(false)
        setExpiresAt('')
        setExpiresAtDate(new Date());
    }

    return (
        <>
            <Pressable
                className="w-full items-center rounded-[30px] bg-app-orange py-3 shadow-md active:opacity-60"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-base font-medium text-white">
                    {text.createInvite}
                </Text>
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
                        <Pressable
                            className="absolute right-4 top-4 z-10"
                            onPress={() => setModalVisible(false)}
                            hitSlop={8}
                        >
                            <Ionicons name="close" size={28} color="#9ca3af"/>
                        </Pressable>

                        <View className="w-full items-center gap-3 pt-2">
                            <Text className="text-xl font-bold text-black">
                                {text.createInvite}
                            </Text>

                            <View className="w-full flex-row items-center rounded-md border border-gray-300 bg-white">
                                <TextInput
                                    value={expiresAt}
                                    editable={false}
                                    placeholder={text.whenTheInviteWillBeInvalid}
                                    className="flex-1 p-3 text-base text-black"
                                    pointerEvents="none"
                                />
                                <Pressable
                                    className="m-1 items-center justify-center rounded-md border border-app-orange px-3 py-2 active:opacity-60"
                                    onPress={showDatepicker}
                                >
                                    <Ionicons name="calendar" size={20} color="#f97316"/>
                                </Pressable>
                            </View>

                            <Pressable
                                className="mt-2 w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                                onPress={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#ffffff"/>
                                ) : (
                                    <Text className="text-base font-medium text-white">
                                        {text.createInvite}
                                    </Text>
                                )}
                            </Pressable>
                            <Pressable
                                className="w-full items-center rounded-[30px] border border-app-orange bg-white py-3 active:opacity-60"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-base font-medium text-black">
                                    {cancelLabel}
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
