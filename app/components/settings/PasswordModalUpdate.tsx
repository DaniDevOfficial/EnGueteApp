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
import {CustomButton} from "../UI/CustomButton";


interface PasswordModalUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (oldPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordModalUpdate({onSuccess, isOpen, onClose}: PasswordModalUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const text = useTexts(['save', 'cancel', 'error', 'allFieldsAreRequired', 'passwordDoesNotMatchError', 'enterYourOldPassword', 'enterYourNewPassword', 'confirmYourNewPassword', 'editPassword']);

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            showToast({
                toast,
                title: text.error,
                description: text.allFieldsAreRequired,
                status: "error",
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast({
                toast,
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
                toast,
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
        <>
            <Modal isOpen={isOpen} onClose={() => handleClose()}>
                <Modal.Content>
                    <Modal.Body>

                        <VStack space={4}>
                            <VStack space={4} alignItems="center" width='100%'>

                                <Text
                                    fontSize={'xl'}
                                    fontWeight={'bold'}
                                >
                                    {text.editPassword}
                                </Text>


                                <VStack
                                    space={2}
                                >

                                    <FormControl>

                                        <Text my={2}>
                                            {text.enterYourOldPassword}
                                        </Text>
                                        <PasswordInput

                                            value={oldPassword}
                                            onChangeText={setOldPassword}
                                            placeholder={text.enterYourOldPassword}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Text my={2}>
                                            {text.enterYourNewPassword}
                                        </Text>
                                        <PasswordInput
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder={text.enterYourNewPassword}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Text my={2}>
                                            {text.confirmYourNewPassword}
                                        </Text>
                                        <PasswordInput
                                            value={confirmNewPassword}
                                            onChangeText={setConfirmNewPassword}
                                            placeholder={text.confirmYourNewPassword}
                                        />
                                    </FormControl>
                                </VStack>

                            </VStack>
                            <VStack space={2} alignItems="center" width='100%'>

                                <CustomButton
                                    width={'100%'}
                                    isLoading={isSaving}
                                    onPress={handleSave}
                                    colorScheme="primary"
                                >
                                    {text.save}
                                </CustomButton>
                                <CustomButton width={'100%'} onlyOutline={true} onPress={onClose}>
                                    <Text>
                                        {text.cancel}
                                    </Text>
                                </CustomButton>

                            </VStack>
                        </VStack>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}