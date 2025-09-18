import React from 'react';
import {Button, HStack, Modal, Text, VStack} from 'native-base';
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {CustomButton} from "./CustomButton";

export function ConfirmationModal({isOpen, onClose, onConfirm, title, message, isLoading = false}: {
    isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; isLoading?: boolean;
}) {
    const text = useTexts(['cancel', 'confirm']);
    return (<Modal isOpen={isOpen} onClose={onClose}>
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
                            <Text>{message}</Text>
                        </VStack>
                        <VStack space={2} alignItems="center" width='100%'>

                            <CustomButton
                                width={'100%'}
                                isLoading={isLoading}
                                onPress={onConfirm}
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
