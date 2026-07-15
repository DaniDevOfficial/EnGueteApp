import React from "react";
import {BackButton} from "../components/Ui/BackButton";
import {Box, ScrollView, Text, VStack} from "native-base";
import {useText} from "../utility/TextKeys/TextKeys";
import {LanguageSelector} from "../components/settings/LanguageSelector";
import {DangerZone} from "../components/settings/DangerZone";
import {PageTitleSection} from "../components/Ui/PageTitleSection";
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
