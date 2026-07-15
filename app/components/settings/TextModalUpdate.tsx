import React, {useEffect, useState} from "react";
import {ActivityIndicator, Modal, Pressable, Text, TextInput, View} from "react-native";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../Ui/Toast";
import {handleLogoutProcedure} from "../../Util";

interface TextUpdateProps {
    title: string;
    initialValue: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (text: string) => Promise<void>;
}

export function TextModalUpdate({title, initialValue, onSuccess, isOpen, onClose}: TextUpdateProps) {
    const navigation = useNavigation();
    const getError = useErrorText();
    const text = useTexts(['save', 'cancel', 'error']);

    const [value, setValue] = useState<string>(initialValue);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    async function handleSave() {
        try {
            setIsSaving(true);
            await onSuccess(value);
            onClose();
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

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/40 px-6">
                <View className="w-full max-w-md rounded-xl bg-white p-5">
                    <View className="w-full items-center gap-8">
                        <Text className="text-xl font-bold text-black">
                            {title}
                        </Text>
                        <TextInput
                            value={value}
                            onChangeText={setValue}
                            placeholder={title}
                            className="w-full rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
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
                            onPress={onClose}
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
