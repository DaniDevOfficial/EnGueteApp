import { Input, Icon, Pressable } from "native-base";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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

    function toggleVisibility() {
        setIsVisible(!isVisible);
    }

    return (
        <Input
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
            secureTextEntry={!isVisible}
            width="100%"
            InputRightElement={
                <Pressable onPress={toggleVisibility}>
                    <Icon
                        as={<Ionicons name={isVisible ? "eye" : "eye-off"} />}
                        size={5}
                        mr="2"
                        color="muted.400"
                    />
                </Pressable>
            }
        />
    );
}
