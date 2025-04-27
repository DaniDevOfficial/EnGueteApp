import {Box, Button, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {checkAuth} from "../repo/Auth";
import {PageSpinner} from "../components/UI/PageSpinner";
import {voidAuthToken} from "../Util";
import {handleInviteToken} from "../Router";

export function Home() {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const text = useTexts(['login', 'signup']);

    const [popupTexts] = useState(useTexts(['maybeLater', 'joinGroup', 'youWereInvited', 'groupInvite']));
    useEffect(() => {
        checkAuthentication();
        async function checkAuthentication() {
            try {
                await checkAuth();
                navigation.navigate('user')
                await handleInviteToken(navigation, popupTexts)
            } catch (e) {
                await voidAuthToken();
                setLoading(false);
                //do nothing, because an error just means that the user is not logged in
            }
        }

    }, [])

    if (loading) {
        return <PageSpinner />
    }


    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4}>
            <Text fontSize="2xl" mb={4}>Welcome to EnGuete!</Text>
            <Button onPress={() => navigation.navigate('login')} my={2}>
                <Text>{text.login}</Text>
            </Button>
            <Button onPress={() =>  navigation.navigate('signup')} my={2}>
                <Text>{text.signup}</Text>
            </Button>
        </Box>
    )
}