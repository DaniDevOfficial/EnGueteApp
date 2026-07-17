import React from "react";
import {Text, View} from "react-native";

interface PageTitleSectionProps {
    title: string;
    color?: string;
    showLine?: boolean;
}

export function PageTitleSection({
                                     title,
                                     color = "black",
                                     showLine = true,
                                 }: PageTitleSectionProps) {
    return (
        <View className="items-center">
            <View className="w-[90%] flex-row items-center gap-4">
                <View
                    className="flex-1"
                >
                    {showLine && (
                        <View
                            className="h-px"
                            style={{backgroundColor: color}}
                        />
                    )}
                </View>

                <Text
                    className="text-center text-xl font-bold"
                    style={{color}}
                >
                    {title}
                </Text>

                <View
                    className="flex-1"
                >
                    {showLine && (
                        <View
                            className="h-px"
                            style={{backgroundColor: color}}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}