import {Box, Spinner, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import {useGroup} from "../context/groupContext";
import {BackButton} from "../components/UI/BackButton";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {GetGroupMemberList, GroupMember} from "../repo/Group";

export function GroupMemberList() {
    const group = useGroup();
    const text = useTexts(['memberList']);
    const [loading, setLoading] = useState(true);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

    useEffect(() => {
        async function loadGroupMembers() {
            try {
                const groupMembers = await GetGroupMemberList(group.group.groupId);
                setGroupMembers(groupMembers);
                console.log(groupMembers);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadGroupMembers();
    },[group.group.groupId]);

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
            </VStack>
        </>
    )
}