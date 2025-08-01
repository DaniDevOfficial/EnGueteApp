import React from 'react';
import {Button, HStack, Modal, Text} from 'native-base';
import {useTexts} from "../../utility/TextKeys/TextKeys";

export function ConfirmationModal({isOpen, onClose, onConfirm, title, message, isLoading = false}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}) {
    const text = useTexts(['cancel', 'confirm']);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    <Text>{message}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <HStack
                        space={1}
                    >
                        <Button variant="ghost" onPress={onClose}>{text.cancel}</Button>
                        <Button
                            isLoading={isLoading}
                            onPress={onConfirm}
                            colorScheme="primary"
                        >
                            {text.confirm}
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
