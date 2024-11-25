import {Box, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {ForbiddenError, getAuthToken, handleLogoutProcedure, UnauthorizedError} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, User as UserType} from "../repo/User";
import {useUser} from "../context/userContext";
import {UserCard} from "../components/user/UserCard";
import {GroupCard} from "../components/user/GroupCard";

export function User() {
    const [userInformation, setUserInformation] = useState<UserType | undefined>()
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    const {user, setUser: setUser} = useUser();

    useEffect(() => {
        getUserData()

        async function getUserData() {
            try {
                const authToken = await getAuthToken()
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
                    navigation.navigate('home')
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

    useEffect(() => {

    }, [user]);

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