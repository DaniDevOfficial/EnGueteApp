import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Spinner} from 'native-base';
import {ForbiddenError, getAuthToken, handleLogoutProcedure, UnauthorizedError} from "../Util";
import {GetGroupInformation} from "../repo/Group";

export function Group() {
    const [groupInformation, setGroupInformation] = useState()
    const [loading, setLoading] = useState(true)
    const route = useRoute();
    const {groupId} = route.params;
    const navigation = useNavigation()
    useEffect(() => {
        getGroupData()

        async function getGroupData() {
            try {
                const authToken = await getAuthToken()

                if (authToken === null) {
                    navigation.navigate('home')
                    return
                }
                const userInformationRes = await GetGroupInformation(groupId, authToken);
                console.log(userInformationRes)
                if (userInformationRes) {
                    setLoading(false)
                }
            } catch (e) {

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure()
                    navigation.navigate('home')
                }

                if (e instanceof ForbiddenError) {
                    console.log('this acction is forbidden for this user')
                }
                console.log(e.message)
            }
        }
    }, [groupId]);

    if (loading || groupInformation === undefined) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" color="emerald.500"/>
            </Box>
        )
    }

    return (
        <Box flex={1} alignItems="center" justifyContent="center">
            it loaded
        </Box>
    );
}
