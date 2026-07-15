import React, {useState} from "react";
import {Linking} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {deleteCurrentUser, handleBackendLogout} from "../../repo/settings/User";
import {handleLogoutProcedure} from "../../Util";
import {TimeoutError, useErrorText} from "../../utility/Errors";
import {showToast} from "../Ui/Toast";
import {useUser} from "../../context/userContext";
import {ConfirmationModal} from "../Ui/ConfirmationModal";
import {clearDatabase} from "../../utility/database";
import {Option, SettingsSectionStack} from "../Ui/SettingSectionStack";

export function DangerZone() {
    const navigation = useNavigation();
    const user = useUser();
    const getError = useErrorText();

    const text = useTexts(['logout', 'error', 'errorNoOfflineLogout', 'dataAndPrivacy', 'errorPleaseEnterCorrectText']);
    const requiredText = useText('deleteAccountRequiredText', {username: user.user.userName});
    const modalText = useTexts(['clearLocalData', 'logout', 'deleteAccount', 'clearLocalDataQuestionText', 'logoutQuestionText', 'deleteAccountInfo']);
    const clearLocalDataLabel = useText('clearLocalData');
    const logoutLabel = useText('logout');
    const privacyPolicyLabel = useText('privacyPolicy');
    const deleteAccountLabel = useText('deleteAccount');
    const confirmDeleteMessage = useText('pleaseEnterTextToConfirm', {'text': requiredText});

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
                    title: text.error,
                    description: text.errorNoOfflineLogout,
                    status: 'error',
                });
                return;
            }
            showToast({
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
                title: text.error,
                description: getError(e.message),
                status: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    }

    function openPrivacyPolicy() {
        const url = process.env.EXPO_PUBLIC_WEB_URL + '#/privacy/'

        Linking.openURL(url).catch(() => {
            console.warn('Could not open privacy policy')
        })
    }

    const options: Option[] = [
        {
            label: clearLocalDataLabel,
            icon: 'delete-sweep',
            onPress: () => setClearDataModalVisible(true),
            iconColor: '#eab308',
        },
        {
            label: logoutLabel,
            icon: 'logout',
            onPress: () => setLogoutModalVisible(true),
            iconColor: '#60a5fa',
        },
        {
            label: privacyPolicyLabel,
            icon: 'article',
            onPress: () => openPrivacyPolicy(),
            textColor: '#6b7280',
            iconColor: '#6b7280',
        },
        {
            label: deleteAccountLabel,
            icon: 'delete-forever',
            onPress: () => setDeleteModalVisible(true),
            textColor: '#ef4444',
            iconColor: '#ef4444',
        },
    ];

    return (
        <>
            <SettingsSectionStack title={text.dataAndPrivacy} options={options}/>

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
                title={modalText.deleteAccount}
                furtherInformationText={modalText.deleteAccountInfo}
                message={confirmDeleteMessage}
                requiredText={requiredText}
            />
        </>
    );
}
