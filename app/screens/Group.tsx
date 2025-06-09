import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button, useToast} from 'native-base';
import {handleLogoutProcedure} from "../Util";
import {GetGroupInformation, Group as GroupInformationType} from "../repo/Group";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {UnauthorizedError, useErrorText} from "../utility/Errors";
import {BackButton} from "../components/UI/BackButton";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/UI/EditButton";
import {PageSpinner} from "../components/UI/PageSpinner";
import {MealList} from "../components/group/MealList";
import {Title} from "../components/UI/Icons/Title";
import {showToast} from "../components/UI/Toast";

export function Group() {
    const route = useRoute();
    const text = useTexts(['createNewMeal', 'member', 'members', 'error']);
    const toast = useToast();
    const getError = useErrorText();
    // @ts-ignore
    const {groupId} = route.params;
    const {setGroup: setGroup} = useGroup();

    const [groupInformation, setGroupInformation] = useState<GroupInformationType | undefined>()
    const [loading, setLoading] = useState(true)




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
                // @ts-ignore this is fine because we make sure that the roleRights are at least a emty array TODO: remove this when cleaning up all the server responses where null can be returnend insetead of the intended value
                setGroupInformation(groupInformation)

                setGroup({
                    groupId: groupInformation.groupInfo.groupId,
                    groupName: groupInformation.groupInfo.groupName,
                    userRoleRights,
                    filterDate: new Date(),
                })
            }
        } catch (e) {

            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
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
            <Title title={groupInformation.groupInfo.groupName} />
            <MealList tempMeals={groupInformation.meals ?? []}/>
            {groupInformation.groupInfo.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL) && (
                <Box position="absolute" bottom={4} left={4} right={4}>
                    <Button onPress={handleNavigate}>
                        {text.createNewMeal}
                    </Button>
                </Box>
            )}
        </>
    );
}
