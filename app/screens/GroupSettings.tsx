import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, Icon, Image, ScrollView, VStack} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useText, useTexts} from "../utility/TextKeys/TextKeys";
import {DangerZone} from "../components/settings/DangerZone";
import {useGroup} from "../context/groupContext";
import {UpdateGroupName, UpdateGroupNameType} from "../repo/Group";
import {PERMISSIONS} from "../utility/Roles";
import {GroupDangerZone} from "../components/settings/GroupDangerZone";


export function GroupSettings() {
    const user = useUser();
    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');
    const group = useGroup();
    const text = useTexts(['updateGroupName']);


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
            <ScrollView>
                <VStack maxH={'100%'} flex={1} alignItems="center" p={"10px 5px"} space={4}>

                    <TextUpdate text={group.group.groupName} title={text.groupName}
                                onSuccess={handleEditGroupName}
                                readonly={!group.group.userRoleRights.includes(PERMISSIONS.CAN_UPDATE_GROUP)}/>
                    {group.group.userRoleRights.includes(PERMISSIONS.CAN_DELETE_GROUP) && (
                        <GroupDangerZone/>
                    )}
                </VStack>
            </ScrollView>
        </>
    )
}