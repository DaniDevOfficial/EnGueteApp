import {Button, FormControl, HStack, Icon, Input, Modal, Switch, Text} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import {useText} from "../../utility/TextKeys/TextKeys";


interface TextUpdateProps {
    title: string;
    text: string;
    readonly?: boolean;
    onSuccess: (text: string) => Promise<void>;
}

export function TextUpdate({title, text,  onSuccess, readonly = false}: TextUpdateProps) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState<string>(text);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave () {
        try {
            setIsSaving(true);
            await onSuccess(value);
            setModalVisible(false);
        } catch (err) {
            console.error('Failed to save:', err); // TODO: error handling
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
                        <Icon as={Ionicons} name="create-outline" size={6} color="black" />
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
                        <Button isLoading={isSaving} onPress={handleSave}>{useText('save')}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {useText('cancel')}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}