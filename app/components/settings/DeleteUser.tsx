import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {useUser} from "../../context/userContext";

export function DeleteUser() {
    const user = useUser();
    const toast = useToast();
    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const [requiredText, setRequiredText] = useState<string>(useText('deleteAccountRequiredText', {'username': user.user.userName}));

    const title = useText('deleteAccount');
    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    async function handleSave() {

        if (value !== user.user.userName) {
            setRequiredText(useText('deleteAccountRequiredText', {'username': user.user.userName}));
            return;
        }

        try {
            setIsSaving(true);
            setModalVisible(false);
        } catch (err) {
            console.error('Failed to save:', err); // TODO: error handling
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
                        <Button isLoading={isSaving} onPress={handleSave}>{useText('save')}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {useText('cancel')}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}