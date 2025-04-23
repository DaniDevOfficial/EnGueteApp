import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {Button, FormControl, Icon, Input, Modal} from "native-base";
import {getSwissDateTimeDisplay} from "../../utility/Dates";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CreateInviteToken, CreateInviteTokenRequest} from "../../repo/group/Invites";


interface CreateInviteProps {
    groupId: string;
    onSuccess: () => Promise<void>;
}


export function CreateInvite({groupId, onSuccess}: CreateInviteProps) {
    const text = useTexts(['createInvite']);

    const [expiresAt, setExpiresAt] = useState<string>();
    const [expiresAtDate, setExpiresAtDate] = useState<Date>(new Date);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    function onChangeDatePicker(event: any, selectedDate?: Date) {
        if (!selectedDate) return;

        setExpiresAtDate(selectedDate);
        const text = getSwissDateTimeDisplay(selectedDate);
        setExpiresAt(text);
    }

    function showMode(currentMode: "date" | "time", onChange = onChangeDatePicker, selectedDate: Date) {
        DateTimePickerAndroid.open({
            value: selectedDate,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    function showDatepicker() {
        showMode("date", (event, selectedDate) => {
            if (selectedDate) {
                onChangeDatePicker(event, selectedDate);
                showMode("time", onChangeDatePicker, selectedDate);
            }
        }, expiresAtDate);
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const data: CreateInviteTokenRequest = {
                groupId: groupId,
                expiresAt: expiresAtDate.toISOString(),
            }
            await CreateInviteToken(data);
            await onSuccess();
            setModalVisible(false)
        } catch (e) {
            console.error(e); //TODO: error handling
        }
        setIsSaving(false)

    };

    return (
        <>
            <Button onPress={() => setModalVisible(true)} my={4}>
                {text.createInvite}
            </Button>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{text.createInvite}</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <Input
                                value={expiresAt}
                                isReadOnly={true}
                                p={3}
                                placeholder="When the meal will take place"
                                InputRightElement={
                                    <Button onPress={() => {
                                        showDatepicker()
                                    }} size="xs" p={3}>
                                        <Icon as={Ionicons} name="calendar" size={5} color={`white`}/>
                                    </Button>
                                }
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
    );

}