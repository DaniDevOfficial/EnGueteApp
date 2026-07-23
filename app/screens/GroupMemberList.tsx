import React, {useEffect, useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {useGroup} from "../context/groupContext";
import {BackButton} from "../components/Ui/BackButton";
import {PageTitleSection} from "../components/Ui/PageTitleSection";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {GetGroupMemberList, GroupMember} from "../repo/Group";
import {MemberCard} from "../components/group/MemberCard";
import {CanPerformAction, PERMISSIONS} from "../utility/Roles";
import {RefreshControl} from "react-native-gesture-handler";
import {useUser} from "../context/userContext";
import {PageSpinner} from "../components/Ui/PageSpinner";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {showToast} from "../components/Ui/Toast";
import {handleLogoutProcedure} from "../Util";
import {resetToUserScreen} from "../utility/navigation";
import {useNavigation} from "@react-navigation/native";

export function GroupMemberList() {
    const {group} = useGroup();
    const {user} = useUser();
    const text = useTexts(['memberList', 'noMembers', 'ifYouSeeThisPleaseReport', 'error']);
    const getError = useErrorText();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [canPerformAction, setCanPerformAction] = useState({
        canKickUser: false,
        canPromoteToAdmin: false,
        canPromoteToManager: false,
    });
    const [refreshing, setRefreshing] = useState(false);

    async function loadGroupMembers() {
        try {
            const members = await GetGroupMemberList(group.groupId);
            setGroupMembers(members);
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
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                navigation.goBack();
                return;
            }
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setCanPerformAction({
            canKickUser: CanPerformAction(group.userRoleRights, PERMISSIONS.CAN_KICK_USERS),
            canPromoteToAdmin: CanPerformAction(group.userRoleRights, PERMISSIONS.CAN_PROMOTE_TO_ADMINS),
            canPromoteToManager: CanPerformAction(group.userRoleRights, PERMISSIONS.CAN_PROMOTE_TO_MANAGER),
        });
        loadGroupMembers();
    }, [group.groupId]);

    async function onRefresh() {
        setRefreshing(true)
        await loadGroupMembers()
        setRefreshing(false)
    }

    if (loading) {
        return <PageSpinner/>
    }

    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.memberList}/>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {groupMembers && groupMembers.length > 0 ? (
                    <View className="gap-3">
                        {groupMembers.map((member) => {
                            const isCurrentUser = member.userId === user.userId;
                            return (
                                <MemberCard
                                    {...member}
                                    key={member.userId}
                                    canKickUser={canPerformAction.canKickUser}
                                    canPromoteToAdmin={canPerformAction.canPromoteToAdmin}
                                    canPromoteToManager={canPerformAction.canPromoteToManager}
                                    isCurrentUser={isCurrentUser}
                                    onChanged={loadGroupMembers}
                                />
                            )
                        })}
                    </View>
                ) : (
                    <View className="mt-16 items-center px-6">
                        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Text className="text-2xl">👥</Text>
                        </View>
                        <Text className="mb-1 text-center text-base font-semibold text-gray-700">
                            {text.noMembers}
                        </Text>
                        <Text className="text-center text-sm text-gray-500">
                            {text.ifYouSeeThisPleaseReport}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </>
    )
}
