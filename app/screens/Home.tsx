import {Box, Button, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {getAuthToken} from "../utility/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useText, useTexts} from "../utility/TextKeys/TextKeys";
import {checkAuth} from "../repo/Auth";
import {PageSpinner} from "../components/UI/PageSpinner";
import {voidAuthToken} from "../Util";

export function Home() {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const text = useTexts(['login', 'signup']);

    useEffect(() => {
        checkAuthentication();
        async function checkAuthentication() {
            try {
                await checkAuth();
                navigation.navigate('user')
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