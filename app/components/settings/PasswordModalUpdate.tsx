import {Button, FormControl, HStack, Icon, Input, Modal, Text, useToast, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";
import {PasswordInput} from "../UI/PasswordInput";


interface PasswordModalUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (oldPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordModalUpdate({onSuccess, isOpen, onClose}: PasswordModalUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const textKeys = useTexts(['save', 'cancel', 'error', 'allFieldsAreRequired', 'passwordDoesNotMatchError', 'enterYourOldPassword', 'enterYourNewPassword', 'confirmYourNewPassword', 'editPassword']);

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            showToast({
                toast,
                title: textKeys.error,
                description: textKeys.allFieldsAreRequired,
                status: "error",
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast({
                toast,
                title: textKeys.error,
                description: textKeys.passwordDoesNotMatchError,
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
                toast,
                title: textKeys.error,
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
        <>
            <Modal isOpen={isOpen} onClose={() => handleClose()}>
                <Modal.Content>
                    <Modal.Header>{textKeys.editPassword}</Modal.Header>
                    <Modal.Body>
                        <VStack
                            space={2}
                        >

                            <FormControl>
                                <Text>
                                    {textKeys.enterYourOldPassword}
                                </Text>
                                <PasswordInput
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    placeholder={textKeys.enterYourOldPassword}
                                />
                            </FormControl>
                            <FormControl>
                                <Text>
                                    {textKeys.enterYourNewPassword}
                                </Text>
                                <PasswordInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder={textKeys.enterYourNewPassword}
                                />
                            </FormControl>
                            <FormControl>
                                <Text>
                                    {textKeys.confirmYourNewPassword}
                                </Text>
                                <PasswordInput
                                    value={confirmNewPassword}
                                    onChangeText={setConfirmNewPassword}
                                    placeholder={textKeys.confirmYourNewPassword}
                                />
                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={isSaving} onPress={handleSave}>{textKeys.save}</Button>
                        <Button variant="ghost" isLoading={isSaving} onPress={() => handleClose()}>
                            {textKeys.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}