import {handleBackendLogout} from "../../repo/settings/User";
import {Button, Text, useToast} from "native-base";
import React from "react";
import {handleLogoutProcedure} from "../../Util";
import {useNavigation} from "@react-navigation/native";
import {TimeoutError} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {useTexts} from "../../utility/TextKeys/TextKeys";

export function Logout() {
    const navigation = useNavigation();
    const toast = useToast();
    const text = useTexts(['logout', 'error', 'errorNoOfflineLogout']);
    async function handleLogoutClick() {
        try {
            await handleBackendLogout();
            await handleLogoutProcedure(navigation)
        } catch (err) {
            if (err instanceof TimeoutError) {
                showToast({
                    toast,
                    title: text.error,
                    description: text.errorNoOfflineLogout,
                    status: 'error',
                });
            }
        }
    }

    return (
        <>
            <Button onPress={handleLogoutClick} colorScheme="red" width="100%" mt={4}>
                <Text color="white" fontWeight="bold">
                    Logout
                </Text>
            </Button>
        </>
    )
}