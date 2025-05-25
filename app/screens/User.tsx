import {Box, Button, Pressable, ScrollView, Text, useToast, VStack} from 'native-base'
import React, {useEffect, useState} from 'react'
import {handleLogoutProcedure} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {GetUserInformation, Group, User as UserType} from "../repo/User";
import {useUser} from "../context/userContext";
import {UserCard} from "../components/user/UserCard";
import {GroupCard} from "../components/user/GroupCard";
import {ForbiddenError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {getAuthToken} from "../utility/Auth";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/UI/EditButton";
import {RefreshControl} from "react-native-gesture-handler";
import {PageSpinner} from "../components/UI/PageSpinner";
import {GroupList} from "../components/user/GroupList";
import {showToast} from "../components/UI/Toast";

export function User() {
    const [userInformation, setUserInformation] = useState<UserType | undefined>()
    const [groupInformation, setGroupInformation] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'yourGroups', 'createNewGroup', 'error']);
    const toast = useToast();
    const getError = useErrorText();
    const navigation = useNavigation();
    const {user, setUser: setUser} = useUser();

    async function getUserData() {

        try {

            const userInformationRes = await GetUserInformation();

            setUserInformation(userInformationRes)
            setGroupInformation(userInformationRes.groups)
            setLoading(false)
        } catch (e) {

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
            }
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })
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


    if (loading || !userInformation || !user) {
        return <PageSpinner/>
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
                <GroupList groupsDefault={groupInformation}/>
            </Box>
            <Button my={4} onPress={handleNavigate}>
                {text.createNewGroup}
            </Button>
        </>
    )
}