import React, {useState} from 'react';
import {Button, FormControl, HStack, Input, Modal, Text, useToast, VStack} from 'native-base';
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {CustomButton} from "./CustomButton";
import {showToast} from "./Toast";

export function ConfirmationModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      message,
                                      isLoading = false,
                                      requiredText = undefined,
                                      furtherInformationText = undefined,
                                  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean,
    requiredText?: string;
    furtherInformationText?: string;
}) {
    const text = useTexts(['cancel', 'confirm', 'error']);
    const toast = useToast();
    const requiredTextInformation = useText('errorPleaseEnterCorrectText', {'text': requiredText ?? ''});
    const [value, setValue] = useState<string>('');

    function submitConfirmation() {
        if (isLoading) {
            return;
        }

        if (requiredText && requiredText !== value) {
            showToast({
                toast,
                title: text.error,
                description: requiredTextInformation,
                status: 'warning',
            });
            return;
        }
        onConfirm();
    }

    return (<Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Body>
                    <VStack space={4}>
                        <VStack space={2} alignItems="center" width='100%'>

                            <Text
                                fontSize={'2xl'}
                                fontWeight={'bold'}
                                textAlign={'center'}
                            >
                                {title}
                            </Text>
                            <Text textAlign={'center'}>{message}</Text>
                            {requiredText && (
                                <>
                                    <FormControl>
                                        <Input
                                            value={value}
                                            onChangeText={setValue}
                                            placeholder={`${requiredText}`}
                                        />
                                    </FormControl>
                                </>
                            )}

                            {furtherInformationText && (
                                <>
                                <Text>{furtherInformationText}</Text>
                                </>
                            )}
                        </VStack>
                        <VStack space={2} alignItems="center" width='100%'>

                            <CustomButton
                                width={'100%'}
                                isLoading={isLoading}
                                onPress={submitConfirmation}
                                colorScheme="primary"
                            >
                                {text.confirm}
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
    );
}
