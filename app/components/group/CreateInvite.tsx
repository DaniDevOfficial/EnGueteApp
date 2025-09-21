import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {Box, Button, FormControl, Icon, Image, Input, Modal, Text, useToast, VStack} from "native-base";
import {getFancyTimeDisplay, getSwissDateTimeDisplay} from "../../utility/Dates";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CreateInviteToken, CreateInviteTokenRequest} from "../../repo/group/Invites";
import {CustomButton} from "../UI/CustomButton";
import {showToast} from "../UI/Toast";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {resetToUserScreen} from "../../utility/navigation";
import {useNavigation} from "@react-navigation/native";


interface CreateInviteProps {
    groupId: string;
    onSuccess: () => Promise<void>;
}


export function CreateInvite({groupId, onSuccess}: CreateInviteProps) {
    const text = useTexts(['createInvite', 'whenTheMealWillTakePlace']);
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

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

            showToast({
                toast,
                title: text.createInvite,
                description: getError(e.message),
                status: "error",
            });

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                return;
            }
        }
        setIsSaving(false)
        setExpiresAt('')
        setExpiresAtDate(new Date());

    };

    return (
        <>
            <CustomButton onPress={() => setModalVisible(true)} my={4}>
                {text.createInvite}
            </CustomButton>
            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Body>
                        <Icon
                            as={<Ionicons name="close"/>}
                            size={7}
                            position={'absolute'}
                            top={'5%'}
                            right={'5%'}
                            color="gray.400"
                            onPress={() => setModalVisible(false)}
                        />
                        <VStack space={2}>
                            <VStack
                                height='auto'
                                width={'100%'}
                                justifyContent={'center'}
                                alignItems='center'
                                space={'3'}
                            >
                                <Text fontSize={'xl'} fontWeight='bold'>
                                    {text.createInvite}
                                </Text>

                                <FormControl>
                                    <Input
                                        value={expiresAt}
                                        isReadOnly={true}
                                        p={3}
                                        placeholder={text.whenTheMealWillTakePlace}
                                        InputRightElement={
                                            <Button
                                                backgroundColor={'green.800'}
                                                onPress={() => {
                                                    showDatepicker()
                                                }} size="xs" p={3}>
                                                <Icon as={Ionicons} name="calendar" backgroundColor={'orange'} size={5}
                                                      color={`white`}/>
                                            </Button>
                                        }
                                    />
                                </FormControl>
                            </VStack>

                            <CustomButton width={'100%'} onPress={handleSave} isLoading={isSaving}>
                                {text.createInvite}
                            </CustomButton>
                            <CustomButton onlyOutline={true} onPress={() => setModalVisible(false)}>
                                <Text>
                                    {useText('cancel')}
                                </Text>
                            </CustomButton>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );

}