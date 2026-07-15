import React, {useState} from "react";
import {ActivityIndicator, Modal, Pressable, Text, View} from "react-native";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../Ui/Toast";
import {handleLogoutProcedure} from "../../Util";
import {PasswordInput} from "../Ui/PasswordInput";

interface PasswordModalUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (oldPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordModalUpdate({onSuccess, isOpen, onClose}: PasswordModalUpdateProps) {
    const navigation = useNavigation();
    const getError = useErrorText();

    const text = useTexts(['save', 'cancel', 'error', 'allFieldsAreRequired', 'passwordDoesNotMatchError', 'enterYourOldPassword', 'enterYourNewPassword', 'confirmYourNewPassword', 'editPassword']);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            showToast({
                title: text.error,
                description: text.allFieldsAreRequired,
                status: "error",
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast({
                title: text.error,
                description: text.passwordDoesNotMatchError,
                status: "error",
            });
            return;
        }

        try {
            setIsSaving(true);
            await onSuccess(oldPassword, newPassword);
            handleClose();
        } catch (e) {
            showToast({
                title: text.error,
                description: getError(e.message),
                status: "error",
            });

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
        } finally {
            setIsSaving(false);
        }
    }

    function handleClose() {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        onClose();
    }

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
            <View className="flex-1 items-center justify-center bg-black/40 px-6">
                <View className="w-full max-w-md rounded-xl bg-white p-5">
                    <View className="w-full items-center gap-4">
                        <Text className="text-xl font-bold text-black">
                            {text.editPassword}
                        </Text>

                        <View className="w-full gap-2">
                            <Text className="my-2 text-base text-black">
                                {text.enterYourOldPassword}
                            </Text>
                            <PasswordInput
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                placeholder={text.enterYourOldPassword}
                            />

                            <Text className="my-2 text-base text-black">
                                {text.enterYourNewPassword}
                            </Text>
                            <PasswordInput
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder={text.enterYourNewPassword}
                            />

                            <Text className="my-2 text-base text-black">
                                {text.confirmYourNewPassword}
                            </Text>
                            <PasswordInput
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                                placeholder={text.confirmYourNewPassword}
                            />
                        </View>
                    </View>

                    <View className="mt-4 w-full items-center gap-2">
                        <Pressable
                            className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#ffffff"/>
                            ) : (
                                <Text className="text-base font-medium text-white">
                                    {text.save}
                                </Text>
                            )}
                        </Pressable>
                        <Pressable
                            className="w-full items-center rounded-[30px] border border-app-orange bg-white py-3 active:opacity-60"
                            onPress={handleClose}
                        >
                            <Text className="text-base font-medium text-black">
                                {text.cancel}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
