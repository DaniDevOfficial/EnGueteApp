import {Button, FormControl, HStack, Icon, Input, Modal, Text, useToast} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";


interface ConfirmProps {
    title: string;
    isOpen: boolean;
    text?: string;
    requiredText?: string;
    onClose: () => void;
    onSuccess: (text: string) => Promise<void>;
}

export function ConfirmModal({title, text, requiredText, onSuccess, isOpen, onClose}: ConfirmProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const textKeys = useTexts(['confirm', 'cancel', 'error', 'areYouSureYouWantToPerfomThisAction']);
    const confirm = useText('pleaseEnterTextToConfirm', {'text': requiredText ?? ''});
    const [value, setValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {

        if (requiredText !== undefined && value !== requiredText) {
            showToast({
                toast,
                title: textKeys.error,
                description: useText('errorPleaseEnterCorrectText', {'text': requiredText}),
                status: 'warning',
            });
            return;
        }

        try {
            setIsSaving(true);
            await onSuccess(value);
            onClose();
        } catch (e) {

            showToast({
                toast,
                title: textKeys.error,
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
                    <Modal.Header>{title}</Modal.Header>
                    <Modal.Body>
                        {text ? (
                            <Text>
                                {text}
                            </Text>
                        ) : (
                            <Text>
                                {textKeys.areYouSureYouWantToPerfomThisAction}
                            </Text>
                        )}


                        {requiredText && (
                            <>
                                <Text>
                                    {confirm}
                                </Text>
                                <FormControl>
                                    <Input
                                        value={value}
                                        onChangeText={setValue}
                                        placeholder={`${requiredText}`}
                                    />
                                </FormControl>
                            </>
                        )}


                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={isSaving} onPress={handleSave}>{textKeys.confirm}</Button>
                        <Button variant="ghost" isLoading={isSaving} onPress={() => onClose()}>
                            {textKeys.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}