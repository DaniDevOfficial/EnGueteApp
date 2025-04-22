import React from "react";
import {Box, HStack, Text} from "native-base";
import {DeleteGroup} from "./DeleteGroup";
import {PERMISSIONS} from "../../utility/Roles";
import {useGroup} from "../../context/groupContext";
import {useText} from "../../utility/TextKeys/TextKeys";

export function GroupDangerZone() {

    const {group} = useGroup();

    return (
        <>
            <HStack alignItems="center" space={4} width={'90%'}>
                <Box flex={1} height="1px" bg="red.500" width={'10px'}/>
                <Text textAlign="center" color="red.500" fontWeight="bold" fontSize="xl">
                    {useText('dangerZone')}
                </Text>
                <Box flex={1} height="1px" bg="red.500"/>
            </HStack>
            {group.userRoleRights && group.userRoleRights.includes(PERMISSIONS.CAN_DELETE_GROUP) && (
                <DeleteGroup/>
            )}

        </>
    );
}
