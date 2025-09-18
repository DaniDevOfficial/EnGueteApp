import {Button, FormControl, HStack, Icon, Input, Modal, Text, useToast} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";
import {TextModalUpdate} from "./TextModalUpdate";


interface TextUpdateProps {
    title: string;
    initialValue: string;
    readonly?: boolean;
    onSuccess: (text: string) => Promise<void>;
}

export function TextUpdate({title, initialValue, onSuccess, readonly = false}: TextUpdateProps) {
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const text = useTexts(['save', 'cancel', 'error']);

    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState<string>(initialValue);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        try {
            setIsSaving(true);
            await onSuccess(value);
            setModalVisible(false);
        } catch (e) {

            showToast({
                toast,
                title: text.error,
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
                    {initialValue}
                </Text>
                {!readonly && (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Icon as={Ionicons} name="create-outline" size={6} color="black"/>
                    </TouchableOpacity>
                )}
            </HStack>

            <TextModalUpdate title={title} initialValue={initialValue}
                             isOpen={isModalVisible}
                             onClose={() => setModalVisible(false)} onSuccess={onSuccess}/>
        </>
    )
}