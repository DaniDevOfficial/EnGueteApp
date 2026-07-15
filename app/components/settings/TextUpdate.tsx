import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TextModalUpdate} from "./TextModalUpdate";

interface TextUpdateProps {
    title: string;
    initialValue: string;
    readonly?: boolean;
    onSuccess: (text: string) => Promise<void>;
}

export function TextUpdate({title, initialValue, onSuccess, readonly = false}: TextUpdateProps) {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View className="mb-2 mt-4 flex-row items-center gap-4">
                <Text className="text-xl font-bold text-black">
                    {initialValue}
                </Text>
                {!readonly && (
                    <Pressable onPress={() => setModalVisible(true)} hitSlop={8}>
                        <Ionicons name="create-outline" size={24} color="black"/>
                    </Pressable>
                )}
            </View>

            <TextModalUpdate
                title={title}
                initialValue={initialValue}
                isOpen={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSuccess={onSuccess}
            />
        </>
    )
}
