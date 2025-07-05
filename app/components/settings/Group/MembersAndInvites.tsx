import {useTexts} from "../../../utility/TextKeys/TextKeys";
import {Option, SettingsSectionStack} from "../../UI/SettingSectionStack";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {CanPerformAction, PERMISSIONS} from "../../../utility/Roles";
import {Button} from "native-base";
import {useGroup} from "../../../context/groupContext";

export function MembersAndInvite() {

    const navigation = useNavigation();
    const group = useGroup();

    const text = useTexts(['memberList', 'membersAndInvites', 'invites']);

    const options: Option[] = [
        {
            label: text.memberList,
            onPress: () => {
                navigation.navigate('memberList')
            },
            icon: 'people-outline'
        },
    ];

    if (CanPerformAction(group.group.userRoleRights, PERMISSIONS.CAN_VIEW_INVITE_LINKS)) {
        options.push({
            label: text.invites,
            onPress: () => {
                navigation.navigate('invites')
            },
            icon: 'link'
        })
    }


    return (
        <>
            <SettingsSectionStack title={text.membersAndInvites} options={options}/>
        </>

    );

}