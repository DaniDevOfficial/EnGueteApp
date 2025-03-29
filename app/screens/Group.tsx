import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button, ScrollView, Spinner, Text} from 'native-base';
import {handleLogoutProcedure} from "../Util";
import {GetGroupInformation, Group as GroupInformationType} from "../repo/Group";
import {GroupInformationHeader} from "../components/group/GroupInformationHeader";
import {MealCard} from "../components/group/MealCard";
import {RefreshControl} from "react-native-gesture-handler";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {resetToHomeScreen} from "../utility/navigation";

export function Group() {
    const [groupInformation, setGroupInformation] = useState<GroupInformationType | undefined>()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const route = useRoute();
    // @ts-ignore
    const {groupId} = route.params;

    const {setGroup: setGroup} = useGroup();


    const navigation = useNavigation()
    useEffect(() => {
        getGroupData()

    }, [groupId]);

    async function getGroupData() {
        try {

            const groupInformation = await GetGroupInformation(groupId);
            if (groupInformation) {
                setLoading(false)
                setGroupInformation(groupInformation)
                setGroup({
                    groupId: groupInformation.groupInfo.groupId,
                    userRoleRights: groupInformation.groupInfo.userRoleRights,
                })
            }
        } catch (e) {

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }

            if (e instanceof ForbiddenError) {
                console.log('This action is forbidden for this user')
                //TODO: toast
            }
            console.log(e.message)
            navigation.goBack();
            setLoading(false)
        }
    }


    if (loading || groupInformation === undefined) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" color="emerald.500"/>
            </Box>
        )
    }

    async function onRefresh() {
        setRefreshing(true)
        await getGroupData()
        setRefreshing(false)

    }

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('group', {
            screen: 'NewMeal',
        });
    }


    return (
        <Box flex={1} alignItems="center">
            <GroupInformationHeader groupInformation={groupInformation.groupInfo}/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {groupInformation.meals && groupInformation.meals.length > 0 ? groupInformation.meals.map((meal) => (
                        <MealCard meal={meal} key={meal.mealId}/>
                    )
                ) : (
                    <>
                        <Text>
                            No meals in this group 😞
                        </Text>
                    </>
                )}
            </ScrollView>
            {groupInformation.groupInfo.userRoleRights && groupInformation.groupInfo.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL) && (
                <Button my={4} onPress={handleNavigate}>
                    Create New Meal
                </Button>
            )}
        </Box>
    );
}
