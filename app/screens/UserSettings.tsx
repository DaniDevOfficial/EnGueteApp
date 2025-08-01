import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, Icon, Image, ScrollView, Text, useToast, VStack} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useText, useTexts} from "../utility/TextKeys/TextKeys";
import {updateUsername} from "../repo/settings/User";
import {LanguageSelector} from "../components/settings/LanguageSelector";
import {ThemeSelector} from "../components/settings/ThemeSelector";
import {DangerZone} from "../components/settings/DangerZone";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {UnauthorizedError, useErrorText} from "../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {showToast} from "../components/UI/Toast";
import {handleLogoutProcedure} from "../Util";
import {AccountSection} from "../components/settings/AccountSection";


export function UserSettings() {

    return (
        <>
            <BackButton/>
            <PageTitleSection title={useText('userSettings')}/>

            <ScrollView>
                <VStack maxH={'100%'} flex={1} p={"10px 5px"} space={4}>
                    <AccountSection/>
                    <LanguageSelector/>
                    <DangerZone/>
                </VStack>
            </ScrollView>
            <Box mt={6} mb={3} pt={3} borderTopWidth="1" borderTopColor="coolGray.200" width="100%" alignItems="center">
                <Text
                    color={'coolGray.400'}
                >
                    EnGuete v1.0.0
                </Text>
            </Box>

        </>
    )
}