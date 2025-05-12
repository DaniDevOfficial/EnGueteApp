import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {useUser} from "../../context/userContext";
import {showToast} from "../UI/Toast";
import {deleteCurrentUser} from "../../repo/settings/User";
import {handleLogoutProcedure} from "../../Util";
import {useNavigation} from "@react-navigation/native";
import {useErrorText} from "../../utility/Errors";

export function DeleteUser() {
    const user = useUser();
    const navigation = useNavigation();
    const toast = useToast();
    const [isModalVisible, setModalVisible] = useState(false);
    const [requiredText] = useState<string>(useText('deleteAccountRequiredText', {'username': user.user.userName}));
    const [value, setValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const title = useText('deleteAccount');
    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    const texts = useTexts(['deleteAccount', 'error', 'errorPleaseEnterCorrectText', 'cancel', 'confirm'])
    const getError = useErrorText();


    async function handleSave() {

        if (value !== requiredText) {
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
    return (
        <>
            <Button onPress={() => setModalVisible(true)} colorScheme="red" width="100%" mt={4}>
                <Text color="white" fontWeight="bold">
                    {title}
                </Text>
            </Button>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{title}</Modal.Header>
                    <Modal.Body>
                        <Text>
                            {pleaseEnterText}
                        </Text>
                        <FormControl>
                            <Input
                                value={value}
                                onChangeText={setValue}
                                placeholder={requiredText}
                            />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={isSaving} colorScheme={value !== requiredText ? "coolGray" : 'primary'} disabled={value !== requiredText} onPress={handleSave}>{texts.confirm}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {texts.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}