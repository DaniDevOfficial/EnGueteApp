import React from 'react';
import {Modal, ModalProps} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export function SafeAreaModal({children, ...props}: ModalProps) {
    return (
        <Modal {...props}>
            <SafeAreaProvider style={{flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
                    {children}
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}
