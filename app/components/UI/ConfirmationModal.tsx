import React, {useState} from 'react';
import {ActivityIndicator, Modal, Pressable, Text, TextInput, View} from "react-native";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "./Toast";

export function ConfirmationModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      message,
                                      isLoading = false,
                                      requiredText = undefined,
                                      furtherInformationText = undefined,
                                  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean,
    requiredText?: string;
    furtherInformationText?: string;
}) {
    const text = useTexts(['cancel', 'confirm', 'error']);
    const requiredTextInformation = useText('errorPleaseEnterCorrectText', {'text': requiredText ?? ''});
    const [value, setValue] = useState('');

    function submitConfirmation() {
        if (isLoading) {
            return;
        }

        if (requiredText && requiredText !== value) {
            showToast({
                title: text.error,
                description: requiredTextInformation,
                status: 'warning',
            });
            return;
        }
        onConfirm();
    }

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/40 px-6">
                <View className="w-full max-w-md rounded-xl bg-white p-5">
                    <View className="w-full items-center gap-2">
                        <Text className="text-center text-2xl font-bold text-black">
                            {title}
                        </Text>
                        <Text className="text-center text-base text-black">
                            {message}
                        </Text>

                        {requiredText && (
                            <TextInput
                                value={value}
                                onChangeText={setValue}
                                placeholder={requiredText}
                                className="mt-2 w-full rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        )}

                        {furtherInformationText && (
                            <Text className="mt-2 text-base text-black">
                                {furtherInformationText}
                            </Text>
                        )}
                    </View>

                    <View className="mt-4 w-full items-center gap-2">
                        <Pressable
                            className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                            onPress={submitConfirmation}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff"/>
                            ) : (
                                <Text className="text-base font-medium text-white">
                                    {text.confirm}
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
    );
}
