import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {useNavigation} from "@react-navigation/native";
import {useGroup} from "../../context/groupContext";
import {DeleteGroupRequest} from "../../repo/Group";
import {resetToUserScreen} from "../../utility/navigation";

export function DeleteGroup() {
    const navigation = useNavigation();
    const toast = useToast();
    const group = useGroup();


    const [isModalVisible, setModalVisible] = useState(false);
    const [requiredText] = useState<string>(useText('deleteGroupRequiredText', {'groupName': group.group.groupName}));
    const [value, setValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    const texts = useTexts(['deleteGroup', 'error', 'errorPleaseEnterCorrectText', 'cancel'])


    async function handleDelete() {

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
            await DeleteGroupRequest(group.group.groupId);
            resetToUserScreen(navigation);
        } catch (err) {
            showToast({
                toast,
                title: texts.error,
                description: 'test',
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
                    {texts.deleteGroup}
                </Text>
            </Button>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{texts.deleteGroup}</Modal.Header>
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
                        <Button isLoading={isSaving} colorScheme={value !== requiredText ? "coolGray" : 'primary'} disabled={value !== requiredText} onPress={handleDelete}>{useText('save')}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {texts.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}