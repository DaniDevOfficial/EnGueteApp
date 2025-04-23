import React from "react";
import {BackButton} from "../components/UI/BackButton";
import {Button, ScrollView, VStack} from "native-base";
import {useUser} from "../context/userContext";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {useGroup} from "../context/groupContext";
import {UpdateGroupName, UpdateGroupNameType} from "../repo/Group";
import {PERMISSIONS, CanPerformAction} from "../utility/Roles";
import {GroupDangerZone} from "../components/settings/GroupDangerZone";
import {useNavigation} from "@react-navigation/native";
import {PageTitleSection} from "../components/UI/PageTitleSection";


export function GroupSettings() {
    const user = useUser();
    const group = useGroup();
    const navigation = useNavigation();
    const text = useTexts(['updateGroupName', 'memberList', 'groupSettings', 'invites']);

    async function handleEditGroupName(newGroupName: string) {
        const params: UpdateGroupNameType = {
            groupId: group.group.groupId,
            groupName: newGroupName,
        }
        try {
            const response = await UpdateGroupName(params)
            group.setGroup({
                ...group.group,
                groupName: newGroupName,
            });

        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.groupSettings}/>
            <ScrollView>

                <VStack maxH={'100%'} flex={1} alignItems="center" p={"10px 5px"} space={4}>

                    <TextUpdate text={group.group.groupName} title={text.updateGroupName}
                                onSuccess={handleEditGroupName}
                                readonly={!group.group.userRoleRights.includes(PERMISSIONS.CAN_UPDATE_GROUP)}/>
                    <Button onPress={() => navigation.navigate('memberList')}>
                        {text.memberList}
                    </Button>

                    {(CanPerformAction(group.group.userRoleRights, PERMISSIONS.CAN_VIEW_INVITE_LINKS)) && (
                        <Button onPress={() => navigation.navigate('invites')}>
                            {text.invites}
                        </Button>
                    )}

                    <GroupDangerZone/>
                </VStack>
            </ScrollView>
        </>
    )
}