import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {useNavigation} from "@react-navigation/native";
import {useGroup} from "../../context/groupContext";
import {DeleteGroupRequest} from "../../repo/Group";
import {resetToUserScreen} from "../../utility/navigation";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";

export function DeleteGroup() {
    const navigation = useNavigation();
    const toast = useToast();
    const group = useGroup();
    const getError = useErrorText();


    const [isModalVisible, setModalVisible] = useState(false);
    const [requiredText] = useState<string>(useText('deleteGroupRequiredText', {'groupName': group.group.groupName}));
    const [value, setValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    const text = useTexts(['deleteGroup', 'error', 'errorPleaseEnterCorrectText', 'cancel'])

    async function handleDelete() {

        if (value !== requiredText) {
            showToast({
                toast,
                title: text.error,
                description: text.errorPleaseEnterCorrectText,
                status: 'error',
            });
            return;
        }

        try {
            setIsSaving(true);
            await DeleteGroupRequest(group.group.groupId);
            resetToUserScreen(navigation);
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                navigation.goBack();
                return;
            }
        } finally {
            setIsSaving(false);

        }
    }

    return (
        <>
            <Button onPress={() => setModalVisible(true)} colorScheme="red" width="100%" mt={4}>
                <Text color="white" fontWeight="bold">
                    {text.deleteGroup}
                </Text>
            </Button>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{text.deleteGroup}</Modal.Header>
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
                        <Button isLoading={isSaving} colorScheme={value !== requiredText ? "coolGray" : 'primary'}
                                disabled={value !== requiredText} onPress={handleDelete}>{useText('save')}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {text.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}