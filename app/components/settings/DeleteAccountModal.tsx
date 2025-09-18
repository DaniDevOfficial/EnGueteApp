import React, { useState } from 'react';
import {Button, FormControl, Input, Modal, Text, VStack} from 'native-base';
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {CustomButton} from "../UI/CustomButton";

export function DeleteAccountModal({ isOpen, onClose, requiredText, onConfirm, isSaving }: {
    isOpen: boolean;
    onClose: () => void;
    requiredText: string;
    onConfirm: (inputValue: string) => void;
    isSaving: boolean;
}) {
    const title = useText('deleteAccount');
    const pleaseEnterText = useText('pleaseEnterTextToConfirm', {'text': requiredText});

    const texts = useTexts(['deleteAccount', 'error', 'errorPleaseEnterCorrectText', 'cancel', 'confirm'])

    const [value, setValue] = useState('');

    const handleConfirm = () => {
        onConfirm(value);
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Body>


                    <VStack space={4}>
                        <VStack space={2} alignItems="center" width='100%'>

                            <Text
                                fontSize={'2xl'}
                                fontWeight={'bold'}
                            >
                                {title}
                            </Text>
                            <Text>{pleaseEnterText}</Text>

                            <FormControl mt={4}>
                                <Input
                                    value={value}
                                    onChangeText={setValue}
                                    placeholder={requiredText}
                                />
                            </FormControl>
                        </VStack>
                        <VStack space={2} alignItems="center" width='100%'>

                            <CustomButton
                                width={'100%'}
                                isLoading={isSaving}
                                onPress={handleConfirm}
                                colorScheme="primary"
                            >
                                {texts.confirm}
                            </CustomButton>
                            <CustomButton width={'100%'} onlyOutline={true} onPress={onClose}>
                                <Text>
                                    {texts.cancel}
                                </Text>
                            </CustomButton>

                        </VStack>
                    </VStack>

                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
