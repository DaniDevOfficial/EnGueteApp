import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText} from "../../utility/TextKeys/TextKeys";
import {useUser} from "../../context/userContext";
import {showToast} from "../UI/Toast";

export function DeleteUser() {
    const user = useUser();
    const toast = useToast();
    const [isModalVisible, setModalVisible] = useState(false);
    const [requiredText, setRequiredText] = useState<string>(useText('deleteAccountRequiredText', {'username': user.user.userName}));
    const [value, setValue] = useState<string>(requiredText);
    const [isSaving, setIsSaving] = useState(false);


    const title = useText('deleteAccount');
    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    async function handleSave() {

        if (value !== requiredText) {
            setRequiredText(useText('deleteAccountRequiredText', {'username': user.user.userName}));
            return;
        }

        try {
            setIsSaving(true);
            setModalVisible(false);

            throw new Error('Not implemented');
        } catch (err) {
            showToast({
                toast,
                title: title,
                description: title,
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
                        <Button isLoading={isSaving} colorScheme={value !== requiredText ? "coolGray" : 'primary'} disabled={value !== requiredText} onPress={handleSave}>{useText('save')}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {useText('cancel')}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}