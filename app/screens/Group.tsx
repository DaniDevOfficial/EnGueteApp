import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button, Flex, ScrollView, Text} from 'native-base';
import {handleLogoutProcedure} from "../Util";
import {GetGroupInformation, Group as GroupInformationType} from "../repo/Group";
import {GroupInformationHeader} from "../components/group/GroupInformationHeader";
import {MealCard} from "../components/group/MealCard";
import {RefreshControl} from "react-native-gesture-handler";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {BackButton} from "../components/UI/BackButton";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/UI/EditButton";
import {PageSpinner} from "../components/UI/PageSpinner";
import {MealList} from "../components/group/MealList";

export function Group() {
    const [groupInformation, setGroupInformation] = useState<GroupInformationType | undefined>()
    const [loading, setLoading] = useState(true)
    const route = useRoute();
    const texts = useTexts(['createNewMeal']);

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
                let userRoleRights: string[] = [];
                if (groupInformation.groupInfo.userRoleRights) {
                    userRoleRights = groupInformation.groupInfo.userRoleRights;
                }
                groupInformation.groupInfo.userRoleRights = userRoleRights;
                setGroupInformation(groupInformation)

                setGroup({
                    groupId: groupInformation.groupInfo.groupId,
                    groupName: groupInformation.groupInfo.groupName,
                    userRoleRights,
                    filterDate: new Date(),
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
        return <PageSpinner/>
    }


    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('group', {
            screen: 'newMeal',
        });
    }


    return (
        <>
            <BackButton color={'green'}/>
            <EditButton navigateTo={'groupSettings'}/>
            <MealList tempMeals={groupInformation.meals ?? []}/>
            {groupInformation.groupInfo.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL) && (
                <Box position="absolute" bottom={4} left={4} right={4}>
                    <Button onPress={handleNavigate}>
                        {texts.createNewMeal}
                    </Button>
                </Box>
            )}
        </>
    );
}
