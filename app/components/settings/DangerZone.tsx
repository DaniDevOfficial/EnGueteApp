import React, { useState } from "react";
import {
    Box, HStack, Icon, Pressable, Text, useToast, VStack
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useText, useTexts } from "../../utility/TextKeys/TextKeys";
import { deleteCurrentUser, handleBackendLogout } from "../../repo/settings/User";
import { handleLogoutProcedure } from "../../Util";
import { TimeoutError, useErrorText } from "../../utility/Errors";
import { showToast } from "../UI/Toast";
import { useUser } from "../../context/userContext";
import {ConfirmationModal} from "../UI/ConfirmationModal";
import {DeleteAccountModal} from "./DeleteAccountModal";
import {clearDatabase} from "../../utility/database";

export function DangerZone() {
    const navigation = useNavigation();
    const toast = useToast();
    const text = useTexts(['logout', 'error', 'errorNoOfflineLogout']);
    const user = useUser();
    const requiredText = useText('deleteAccountRequiredText', { username: user.user.userName });
    const texts = useTexts(['deleteAccount', 'error', 'errorPleaseEnterCorrectText', 'cancel', 'confirm']);
    const modalText = useTexts(['clearLocalData', 'logout', 'deleteAccount', 'clearLocalDataQuestionText', 'logoutQuestionText']);
    const getError = useErrorText();

    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isClearDataModalVisible, setClearDataModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    async function handleLogoutClick() {
        try {
            await handleBackendLogout();
            await handleLogoutProcedure(navigation);
        } catch (e) {
            if (e instanceof TimeoutError) {
                showToast({
                    toast,
                    title: text.error,
                    description: text.errorNoOfflineLogout,
                    status: 'error',
                });
                return;
            }
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: 'error',
            });
        }
    }

    async function handleDeletingAccount(input: string) {
        if (input !== requiredText) {
            showToast({
                toast,
                title: texts.error,
                description: texts.errorPleaseEnterCorrectText,
                status: 'error',
            });
            return;
        }

        try {
            setIsSaving(true);
            await deleteCurrentUser();
            await handleLogoutProcedure(navigation);
        } catch (e) {
            showToast({
                toast,
                title: texts.error,
                description: getError(e.message),
                status: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    }

    const options = [
        {
            label: useText('clearLocalData'),
            icon: 'trash',
            onPress: () => setClearDataModalVisible(true),
            iconColor: 'yellow.500',
        },
        {
            label: useText('logout'),
            icon: 'log-out-outline',
            onPress: () => setLogoutModalVisible(true),
            iconColor: 'blue.400',
        },
        {
            label: useText('deleteAccount'),
            icon: 'close-circle-outline',
            onPress: () => setDeleteModalVisible(true),
            textColor: 'red.500',
            iconColor: 'red.500',
        }
    ];

    return (
        <>
            <VStack space={2}>
                <Box>
                    <Text fontWeight="bold" fontSize="xl">Data & Privacy</Text>
                </Box>
                <VStack
                    borderColor="coolGray.300"
                    borderWidth={1}
                    borderRadius="md"
                    px={2}
                >
                    {options.map((option, index) => (
                        <Pressable key={index} onPress={option.onPress}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack
                                    alignItems="center"
                                    space={2}
                                    p={2}
                                    borderRadius="md"
                                    bg="coolGray.100"
                                >
                                    <Icon
                                        color={option.iconColor || 'coolGray.500'}
                                        size={6}
                                        as={Ionicons}
                                        name={option.icon}
                                    />
                                    <Text
                                        color={option.textColor || 'coolGray.800'}
                                        fontWeight="medium"
                                    >
                                        {option.label}
                                    </Text>
                                </HStack>
                                <Icon
                                    as={Ionicons}
                                    name="chevron-forward-outline"
                                    size={5}
                                />
                            </HStack>
                            {index < options.length - 1 && (
                                <Box height="1px" bg="coolGray.200" mx={2} my={1} />
                            )}
                        </Pressable>
                    ))}
                </VStack>
            </VStack>

            {/* Modal Popups */}
            <ConfirmationModal
                isOpen={isClearDataModalVisible}
                onClose={() => setClearDataModalVisible(false)}
                onConfirm={() => {
                    console.log("Cleared local data!");
                    clearDatabase()
                    setClearDataModalVisible(false);
                }}
                title={modalText.clearLocalData}
                message={modalText.clearLocalDataQuestionText}
            />

            <ConfirmationModal
                isOpen={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onConfirm={() => {
                    handleLogoutClick();
                    setLogoutModalVisible(false);
                }}
                title={modalText.logout}
                message={modalText.logoutQuestionText}
            />

            <DeleteAccountModal
                isOpen={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                requiredText={requiredText}
                onConfirm={handleDeletingAccount}
                isSaving={isSaving}
            />
        </>
    );
}
