import React from "react";
import {ScrollView, Text, View} from "react-native";
import {BackButton} from "../components/Ui/BackButton";
import {useText} from "../utility/TextKeys/TextKeys";
import {LanguageSelector} from "../components/settings/LanguageSelector";
import {DangerZone} from "../components/settings/DangerZone";
import {PageTitleSection} from "../components/Ui/PageTitleSection";
import {AccountSection} from "../components/settings/AccountSection";

export function UserSettings() {
    return (
        <View className="flex-1">
            <BackButton/>
            <PageTitleSection title={useText('userSettings')}/>

            <ScrollView className="flex-1" contentContainerStyle={{flexGrow: 1}}>
                <View className="flex-1 gap-4 px-1 py-2.5">
                    <AccountSection/>
                    <LanguageSelector/>
                    <DangerZone/>
                </View>
            </ScrollView>

            <View className="mb-3 mt-6 w-full items-center border-t border-gray-200 pt-3">
                <Text className="text-gray-400">
                    EnGuete v1.0.0
                </Text>
            </View>
        </View>
    )
}
