import {Box, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {getAuthToken, UnauthorizedError} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, User as UserType} from "../repo/User";

export function User() {
    const [userInformation, setUserInformation] = useState<UserType | undefined>()
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();
    useEffect(() => {
        getUserData()

        async function getUserData() {
            try {
                const authToken = await getAuthToken()
                if (authToken === null) {
                    navigation.navigate('home')
                }
                const userInformationRes = await GetUserInformation(authToken);
                console.log(userInformationRes)
                if (userInformationRes) {
                    setUserInformation(userInformationRes)
                    setLoading(false)
                }
            } catch (e) {

                if (e instanceof UnauthorizedError) {
                    navigation.navigate('home')
                }

                console.log(e.message)
            }
        }
    }, [])

    if (loading || !userInformation) {

    }

    return (
        <Box flex={1} justifyContent="center" p={4}>
            <Text fontSize="2xl" mb={4}>Yaaaa your logged in!</Text>

        </Box>
    )
}