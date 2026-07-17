import React, {useState} from 'react';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {Pressable, Text, View} from "react-native";
import {handleLogoutProcedure} from "../Util";
import {GetGroupInformation, Group as GroupInformationType} from "../repo/Group";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {UnauthorizedError, useErrorText} from "../utility/Errors";
import {BackButton} from "../components/Ui/BackButton";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {EditButton} from "../components/Ui/EditButton";
import {PageSpinner} from "../components/Ui/PageSpinner";
import {MealList} from "../components/group/MealList";
import {Title} from "../components/Ui/Icons/Title";
import {showToast} from "../components/Ui/Toast";

export function Group() {
    const route = useRoute();
    const text = useTexts(['createNewMeal', 'member', 'members', 'error']);
    const getError = useErrorText();
    // @ts-ignore
    const {groupId} = route.params;
    const {setGroup: setGroup} = useGroup();

    const [groupInformation, setGroupInformation] = useState<GroupInformationType | undefined>()
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    useFocusEffect(
        React.useCallback(() => {
            getGroupData()

            return () => {
                // this runs when the screen is unfocused, so we dont do anythin
            };
        }, [])
    );

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
        navigation.navigate('newMeal');
    }

    return (
        <View className="flex-1">
            <BackButton color={'black'}/>
            <EditButton navigateTo={'groupSettings'}/>
            <Title title={groupInformation.groupInfo.groupName}/>
            <MealList tempMeals={groupInformation.meals ?? []}/>
            {groupInformation.groupInfo.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL) && (
                <View className="absolute bottom-4 left-4 right-4">
                    <Pressable
                        className="w-full items-center rounded-[30px] bg-app-orange py-3 shadow-md active:opacity-60"
                        onPress={handleNavigate}
                    >
                        <Text className="text-base font-medium text-white">
                            {text.createNewMeal}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
