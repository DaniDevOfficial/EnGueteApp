import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button, Spinner, Text} from 'native-base';
import {ForbiddenError, getAuthToken, handleLogoutProcedure, UnauthorizedError} from "../Util";
import {GetGroupInformation, Group as GroupInformationType} from "../repo/Group";
import {GroupInformationHeader} from "../components/group/GroupInformationHeader";
import {MealCard} from "../components/group/MealCard";

export function Group() {
    const [groupInformation, setGroupInformation] = useState<GroupInformationType | undefined>()
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
                const groupInformation = await GetGroupInformation(groupId, authToken);

                if (groupInformation) {
                    setLoading(false)
                    setGroupInformation(groupInformation)
                }
            } catch (e) {

                if (e instanceof UnauthorizedError) {
                    await handleLogoutProcedure()
                    navigation.navigate('home')
                }

                if (e instanceof ForbiddenError) {
                    console.log('This action is forbidden for this user')
                    //TODO: toast
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
        <Box flex={1} alignItems="center">
            <GroupInformationHeader groupInformation={groupInformation.groupInfo}/>
            {groupInformation.meals && groupInformation.meals.length > 0 ? groupInformation.meals.map((meal) => (
                    <MealCard meal={meal} key={meal.mealId}/>
                )
            ) : (
                <>
                    <Text>
                        No meals in this group
                    </Text>
                </>
            )}
            <Button onPress={() => navigation.navigate('newMeal', {groupId: groupId})}>
                Create New Meal
            </Button>
        </Box>
    );
}
