import {Box, Button, Pressable, ScrollView, Text, VStack} from 'native-base'
import React, {useEffect, useState} from 'react'
import {handleLogoutProcedure} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, Group, User as UserType} from "../repo/User";
import {useUser} from "../context/userContext";
import {UserCard} from "../components/user/UserCard";
import {GroupCard} from "../components/user/GroupCard";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {getAuthToken} from "../utility/Auth";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/UI/EditButton";
import {RefreshControl} from "react-native-gesture-handler";
import {PageSpinner} from "../components/UI/PageSpinner";

export function User() {
    const [userInformation, setUserInformation] = useState<UserType | undefined>()
    const [groupInformation, setGroupInformation] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'yourGroups', 'createNewGroup']);

    const navigation = useNavigation();

    const {user, setUser: setUser} = useUser();

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
                setGroupInformation(userInformationRes.groups)
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

    useEffect(() => {
        getUserData()
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

    async function onRefresh() {
        setRefreshing(true)
        await getUserData()
        setRefreshing(false)
    }

    if (loading || !userInformation || !user) {
        return <PageSpinner />
    }

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('newGroup');
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
                <Text fontWeight={"bold"} fontSize={"2xl"}>{text.yourGroups}</Text>
                <ScrollView
                    w={'100%'}
                    contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                >
                    <VStack alignItems="center" w={'100%'}>
                        {userInformation.groups && userInformation.groups.length > 0 ? (userInformation.groups.map((group) => (
                                <GroupCard group={group} key={group.groupId}/>
                            ))
                        ) : (
                            <Box mt={5}>
                                <Text color={"gray.500"} textAlign={"center"}>
                                    {text.youAreInNoGroup}
                                </Text>

                                <Text color={"gray.500"} textAlign={"center"}>
                                    {text.startByJoiningOrCreating}
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </ScrollView>
            </Box>
            <Button my={4} onPress={handleNavigate}>
                {text.createNewGroup}
            </Button>
        </>
    )
}