import {Button, FormControl, Input, Modal, Text, useToast} from "native-base";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {useNavigation} from "@react-navigation/native";
import {useGroup} from "../../context/groupContext";
import {DeleteGroupRequest, LeaveGroupRequest} from "../../repo/Group";
import {resetToUserScreen} from "../../utility/navigation";

export function LeaveGroup() {
    const navigation = useNavigation();
    const toast = useToast();
    const group = useGroup();


    const [isModalVisible, setModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const text = useTexts(['leaveGroup', 'error', 'cancel', 'submit', ])

    const leaveInfoText = useText('leaveGroupInfoText', {'groupName': group.group.groupName});
    async function handleLeave() {
        try {
            setIsSaving(true);
            await LeaveGroupRequest(group.group.groupId);
            resetToUserScreen(navigation);
        } catch (err) {
            //TODO: error handling
            showToast({
                toast,
                title: text.error,
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
                    {text.leaveGroup}
                </Text>
            </Button>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{text.leaveGroup}</Modal.Header>
                    <Modal.Body>
                        <Text>
                            {leaveInfoText}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={isSaving}  onPress={handleLeave}>
                            {text.submit}
                        </Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {text.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}