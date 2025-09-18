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
import {clearDatabase} from "../../utility/database";
import {Option, SettingsSectionStack} from "../UI/SettingSectionStack";



export function DangerZone() {
    const navigation = useNavigation();
    const toast = useToast();
    const user = useUser();
    const getError = useErrorText();

    const text = useTexts(['logout', 'error', 'errorNoOfflineLogout', 'dataAndPrivacy', 'errorPleaseEnterCorrectText']);
    const requiredText = useText('deleteAccountRequiredText', { username: user.user.userName });
    const modalText = useTexts(['clearLocalData', 'logout', 'deleteAccount', 'clearLocalDataQuestionText', 'logoutQuestionText']);

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

    async function handleDeletingAccount() {

        try {
            setIsSaving(true);
            await deleteCurrentUser();
            await handleLogoutProcedure(navigation);
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    }

    const options: Option[] = [
        {
            label: useText('clearLocalData'),
            icon: 'delete-sweep',
            onPress: () => setClearDataModalVisible(true),
            iconColor: 'yellow.500',
        },
        {
            label: useText('logout'),
            icon: 'logout',
            onPress: () => setLogoutModalVisible(true),
            iconColor: 'blue.400',
        },
        {
            label: useText('deleteAccount'),
            icon: 'delete-forever',
            onPress: () => setDeleteModalVisible(true),
            textColor: 'red.500',
            iconColor: 'red.500',
        }
    ];

    return (
        <>
            <SettingsSectionStack title={text.dataAndPrivacy} options={options} />

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
            <ConfirmationModal
                isOpen={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={() => {
                    handleDeletingAccount();
                    setDeleteModalVisible(false);
                }}
                isLoading={isSaving}
                title={modalText.logout}
                message={useText('pleaseEnterTextToConfirm', {'text': requiredText})}
                requiredText={requiredText}

            />

        </>
    );
}
