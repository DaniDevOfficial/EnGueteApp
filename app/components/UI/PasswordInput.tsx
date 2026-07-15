import {useState} from "react";
import {Pressable, TextInput, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export function PasswordInput({
                                  value,
                                  onChangeText,
                                  placeholder = "Enter Password",
                              }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View className="w-full flex-row items-center rounded-md border border-gray-300 bg-white">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={!isVisible}
                className="flex-1 p-3 text-base text-black"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Pressable onPress={() => setIsVisible(!isVisible)} className="px-3" hitSlop={8}>
                <Ionicons
                    name={isVisible ? "eye" : "eye-off"}
                    size={20}
                    color="#9ca3af"
                />
            </Pressable>
        </View>
    );
}
