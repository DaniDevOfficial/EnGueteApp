import React, { useState } from 'react';
import { Button, FormControl, Input, Modal, Text } from 'native-base';
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";

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
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    <Text>{pleaseEnterText}</Text>
                    <FormControl mt={4}>
                        <Input
                            value={value}
                            onChangeText={setValue}
                            placeholder={requiredText}
                        />
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        isLoading={isSaving}
                        colorScheme={value !== requiredText ? 'coolGray' : 'danger'}
                        isDisabled={value !== requiredText}
                        onPress={handleConfirm}
                    >
                        {texts.confirm}
                    </Button>
                    <Button variant="ghost" onPress={onClose}>{texts.cancel}</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
