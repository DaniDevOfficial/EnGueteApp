import {Box, Pressable, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {handleLogoutProcedure} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, User as UserType} from "../repo/User";
import {useUser} from "../context/userContext";
import {UserCard} from "../components/user/UserCard";
import {GroupCard} from "../components/user/GroupCard";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {getAuthToken, getRefreshToken, getTesting} from "../utility/Auth";
import {resetToHomeScreen} from "../utility/navigation";

export function User() {
    const [userInformation, setUserInformation] = useState<UserType | undefined>()
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    const {user, setUser: setUser} = useUser();

    async function testing() {
        const refreshToken = await getRefreshToken();
        const authToken = await getAuthToken();
        const testing = await getTesting();
        console.log({
            testing: testing,
            refreshToken: refreshToken,
            authToken: authToken
        })
    }


    useEffect(() => {
        getUserData()

        async function getUserData() {
            try {
                const authToken = await getAuthToken()
                console.log(authToken + ' :AuthToken');
                if (authToken === null) {
                    navigation.navigate('home')
                    return
                }
                const userInformationRes = await GetUserInformation(authToken);
                console.log(userInformationRes)
                if (userInformationRes) {
                    setUserInformation(userInformationRes)
                    setLoading(false)
                }
            } catch (e) {

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure()
                    //TODO: isauthenticated set to false or something like that in the auth context
                    resetToHomeScreen(navigation)

                }

                if (e instanceof ForbiddenError){
                    console.log('this acction is forbidden for this user')
                }
                console.log(e.message)
            }
        }
    }, [])

    useEffect(() => {

        if (userInformation === undefined) {
            return
        }

        setUser({
            userName: userInformation.username,
            userId: userInformation.userId,
            profilePicture: userInformation?.profilePicture ?? 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png',
        });
    }, [userInformation]);

    if (loading || !userInformation || !user) {
        return (
            <>
                <Text>
                    Is loading...
                </Text>
            </>
        )
    }

    return (
        <Box flex={1} alignItems="center" p={"30px 5px"}>
            <UserCard user={user}/>
            <Box
                height="1px"
                width="90%"
                backgroundColor="coolGray.300"
                marginY="3px"
            />
            <Pressable onPress={testing}>
                <Text>
                    Testing
                </Text>
            </Pressable>
            <Text fontWeight={"bold"} fontSize={"2xl"}>Your Groups</Text>
            {userInformation.groups && userInformation.groups.length > 0 ? (userInformation.groups.map((group) => (
                    <GroupCard group={group} key={group.groupId}/>
                ))
            ) : (
                <Box mt={5}>
                    <Text color={"gray.500"} textAlign={"center"}>
                        It looks like you are in no group 😞
                    </Text>

                    <Text color={"gray.500"} textAlign={"center"}>
                        Start by joining or creating a group 🦾
                    </Text>
                </Box>
            )}
        </Box>
    )
}