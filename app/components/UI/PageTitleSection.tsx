import React from "react";
import {Text, View} from "react-native";

interface PageTitleSectionProps {
    title: string;
    color?: string;
}

export function PageTitleSection({title, color = "black"}: PageTitleSectionProps) {
    return (
        <View className="items-center">
            <View className="w-[90%] flex-row items-center gap-4">
                <View className="h-px flex-1" style={{backgroundColor: color}}/>
                <Text
                    className="text-center text-xl font-bold"
                    style={{color}}
                >
                    {title}
                </Text>
                <View className="h-px flex-1" style={{backgroundColor: color}}/>
            </View>
        </View>
    );
}
