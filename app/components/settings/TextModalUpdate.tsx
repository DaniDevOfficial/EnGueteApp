import {Button, FormControl, HStack, Icon, Input, Modal, Text, useToast} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";


interface TextUpdateProps {
    title: string;
    text: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (text: string) => Promise<void>;
}

export function TextModalUpdate({title, text, onSuccess, isOpen, onClose }: TextUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const textKeys = useTexts(['save', 'cancel', 'error']);

    const [value, setValue] = useState<string>(text);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {



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
                        <FormControl>
                            <Input
                                value={value}
                                onChangeText={setValue}
                                placeholder={`Enter new ${title}`}
                            />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button isLoading={isSaving} onPress={handleSave}>{textKeys.save}</Button>
                        <Button variant="ghost" isLoading={isSaving} onPress={() => onClose()}>
                            {textKeys.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}