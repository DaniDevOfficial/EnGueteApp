import React from "react";
import {ActivityIndicator, View} from "react-native";

export function PageSpinner() {
    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f97316"/>
        </View>
    )
}
