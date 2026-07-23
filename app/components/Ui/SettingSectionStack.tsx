import React from "react";
import {Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {MaterialIcons} from "@expo/vector-icons";
import {colors} from "../../theme/colors";

export interface Option {
    label: string;
    icon: string;
    onPress: () => void;
    iconColor?: string;
    textColor?: string;
}

export function SettingsSectionStack({options, title}: { options: Option[], title: string }) {
    return (
        <View className="gap-2">
            <Text className="text-xl font-bold text-ink">{title}</Text>
            <View className="rounded-md border border-surface-border px-2 py-2">
                {options.map((option, index) => (
                    <Pressable key={index} onPress={option.onPress}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2 rounded-md p-2">
                                <MaterialIcons
                                    name={option.icon as any}
                                    size={24}
                                    color={option.iconColor || colors.ink.muted}
                                />
                                <Text
                                    className="font-medium"
                                    style={{color: option.textColor || colors.gray[800]}}
                                >
                                    {option.label}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color={colors.ink.muted}
                            />
                        </View>
                        {index < options.length - 1 && (
                            <View className="mx-2 my-1 h-px bg-surface-border"/>
                        )}
                    </Pressable>
                ))}
            </View>
        </View>
    )
}
