import {Box, Button, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {getAuthToken} from "../Util";
import {useNavigation} from "@react-navigation/native";

export function Home() {
    const [token, setToken] = useState("no token yet")
    const navigation = useNavigation();
    useEffect(() => {
        getToken()

        async function getToken() {
            try {
                const authToken = await getAuthToken();
                console.log(authToken)
                if (authToken) {
                    setToken(authToken)
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }, [])

    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4}>
            {token}
            <Text fontSize="2xl" mb={4}>Welcome to EnGuete!</Text>
            <Button onPress={() => navigation.navigate('login')} my={2}>
                <Text>Login</Text>
            </Button>
            <Button onPress={() =>  navigation.navigate('signup')} my={2}>
                <Text>Sing up</Text>
            </Button>
        </Box>
    )
}