import {Box, Pressable, Spinner, Text} from 'native-base'
import React, {useEffect, useState} from 'react'
import {handleLogoutProcedure} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, User as UserType} from "../repo/User";
import {useUser} from "../context/userContext";
import {UserCard} from "../components/user/UserCard";
import {GroupCard} from "../components/user/GroupCard";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {getAuthToken} from "../utility/Auth";
import {useText} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/UI/EditButton";

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

                if (userInformationRes) {
                    setUserInformation(userInformationRes)
                    setLoading(false)
                }
            } catch (e) {

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure(navigation)
                }

                if (e instanceof ForbiddenError) {
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
            email: '',
        });
    }, [userInformation]);

    if (loading || !userInformation || !user) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" color="emerald.500"/>
            </Box>
        )
    }

    return (
        <>
            <EditButton navigateTo={'userSettings'}/>
            <Box flex={1} alignItems="center" p={"10px 5px"}>
                <UserCard user={user}/>
                <Box
                    height="1px"
                    width="90%"
                    backgroundColor="coolGray.300"
                    marginY="3px"
                />
                <Pressable
                    onPress={() => {
                        navigation.navigate('test')
                    }}
                >
                    <Text>Test</Text>
                </Pressable>
                <Text fontWeight={"bold"} fontSize={"2xl"}>{useText('yourGroups')}</Text>
                {userInformation.groups && userInformation.groups.length > 0 ? (userInformation.groups.map((group) => (
                        <GroupCard group={group} key={group.groupId}/>
                    ))
                ) : (
                    <Box mt={5}>
                        <Text color={"gray.500"} textAlign={"center"}>
                            {useText('youAreInNoGroup')}
                        </Text>

                        <Text color={"gray.500"} textAlign={"center"}>
                            {useText('startByJoiningOrCreating')}
                        </Text>
                    </Box>
                )}
            </Box>
        </>
    )
}