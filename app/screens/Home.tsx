import {Box, Button, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {checkAuth} from "../repo/Auth";
import {PageSpinner} from "../components/UI/PageSpinner";
import {voidAuthToken} from "../Util";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {resetToUserScreen} from "../utility/navigation";
import {TokenPopupHandler} from "../components/Utility/JoinGroupPopup";

export function Home() {
    const [loading, setLoading] = useState(true);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const navigation = useNavigation();

    const text = useTexts(['login', 'signup']);

    const [popupTexts] = useState(useTexts(['maybeLater', 'joinGroup', 'youWereInvited', 'groupInvite']));
    useEffect(() => {
        checkAuthentication();

        async function checkAuthentication() {
            try {
                await checkAuth();
                resetToUserScreen(navigation)
                const token = await getPendingInviteToken();

                if (token) {
                    setInviteToken(token);
                }
            } catch (e) {
                await voidAuthToken();
                setLoading(false);
                //do nothing, because an error just means that the user is not logged in
            }
        }

    }, [])

    if (loading) {
        return (
            <>
                {inviteToken && (
                    <TokenPopupHandler
                        token={inviteToken}
                    />
                )}
                <PageSpinner/>
            </>
        )
    }


    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4}>
            {inviteToken && (
                <TokenPopupHandler
                    token={inviteToken}
                />
            )}
            <Text fontSize="2xl" mb={4}>Welcome to EnGuete!</Text>
            <Button onPress={() => navigation.navigate('login')} my={2}>
                <Text>{text.login}</Text>
            </Button>
            <Button onPress={() => navigation.navigate('signup')} my={2}>
                <Text>{text.signup}</Text>
            </Button>
        </Box>
    )
}