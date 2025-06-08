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
    readonly?: boolean;
    onSuccess: (text: string) => Promise<void>;
}

export function TextUpdate({title, text, onSuccess, readonly = false}: TextUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const textKeys = useTexts(['save', 'cancel', 'error']);

    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState<string>(text);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        try {
            setIsSaving(true);
            await onSuccess(value);
            setModalVisible(false);
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
            <HStack alignItems="center" space={4} mt={4} mb={2}>
                <Text fontSize="xl" fontWeight="bold">
                    {text}
                </Text>

                {!readonly && (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Icon as={Ionicons} name="create-outline" size={6} color="black"/>
                    </TouchableOpacity>
                )}
            </HStack>

            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
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
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {textKeys.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}