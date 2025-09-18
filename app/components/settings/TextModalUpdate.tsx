import {FormControl, Input, Modal, Text, useToast, VStack} from "native-base";
import React, {useState} from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";
import {CustomButton} from "../UI/CustomButton";


interface TextUpdateProps {
    title: string;
    initialValue: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (text: string) => Promise<void>;
}

export function TextModalUpdate({title, initialValue, onSuccess, isOpen, onClose}: TextUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const text = useTexts(['save', 'cancel', 'error']);

    const [value, setValue] = useState<string>(initialValue);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {


        try {
            setIsSaving(true);
            await onSuccess(value);
            onClose();
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

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => onClose()}>
                <Modal.Content>
                    <Modal.Body>

                        <VStack space={4}>
                            <VStack space={8} alignItems="center" width='100%'>

                                <Text
                                    fontSize={'xl'}
                                    fontWeight={'bold'}
                                >
                                    {title}
                                </Text>
                                <FormControl>
                                    <Input
                                        value={value}
                                        onChangeText={setValue}
                                        placeholder={`${title}`}
                                    />
                                </FormControl>
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