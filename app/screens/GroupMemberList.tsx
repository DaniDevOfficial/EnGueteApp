import {Box, ScrollView, Text, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import {useGroup} from "../context/groupContext";
import {BackButton} from "../components/UI/BackButton";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {GetGroupMemberList, GroupMember} from "../repo/Group";
import {MemberCard} from "../components/group/MemberCard";
import {CanPerformAction, PERMISSIONS} from "../utility/Roles";
import {RefreshControl} from "react-native-gesture-handler";
import {useUser} from "../context/userContext";
import {PageSpinner} from "../components/UI/PageSpinner";

export function GroupMemberList() {
    const {group} = useGroup();
    const {user} = useUser();
    const text = useTexts(['memberList', 'noMembers', 'ifYouSeeThisPleaseReport']);
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
            const groupMembers = await GetGroupMemberList(group.groupId);
            setGroupMembers(groupMembers);
        } catch (e) {
            console.error(e);
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
        return <PageSpinner />
    }
    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.memberList}/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <VStack alignItems="center" space={4}>
                    {groupMembers && groupMembers.length > 0 ? (groupMembers.map((member, index) => {
                        const isCurrentUser = member.userId === user.userId;
                        return (
                            <>
                                <MemberCard {...member} key={index}
                                            canKickUser={canPerformAction.canKickUser}
                                            canPromoteToAdmin={canPerformAction.canPromoteToAdmin}
                                            canPromoteToManager={canPerformAction.canPromoteToManager}
                                            isCurrentUser={isCurrentUser}
                                />
                            </>
                        )})
                    ) : (
                        <Box mt={5}>
                            <Text color={"gray.500"} textAlign={"center"}>
                                {text.noMembers}
                            </Text>
                            <Text color={"gray.500"} textAlign={"center"}>
                                {text.ifYouSeeThisPleaseReport}
                            </Text>
                        </Box>
                    )}
                </VStack>
            </ScrollView>
        </>
    )
}