import {Box, Spinner, Text, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import {useGroup} from "../context/groupContext";
import {BackButton} from "../components/UI/BackButton";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {GetGroupMemberList, GroupMember} from "../repo/Group";
import {MemberCard} from "../components/group/MemberCard";

export function GroupMemberList() {
    const {group} = useGroup();
    const text = useTexts(['memberList', 'noMembers', 'ifYouSeeThisPleaseReport']);
    const [loading, setLoading] = useState(true);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    useEffect(() => {
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

        loadGroupMembers();
    }, [group.groupId]);

    if (loading) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" color="emerald.500"/>
            </Box>
        )
    }

    return (
        <>
            <BackButton/>
            <VStack alignItems="center" space={4}>
                <PageTitleSection title={text.memberList}/>
                {groupMembers && groupMembers.length > 0 ? (groupMembers.map((member, index) => (
                        <>
                            <MemberCard {...member} key={index}  canKickUser={true} canPromoteToAdmin={true} canPromoteToManager={true}/>
                        </>
                    ))
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
        </>
    )
}