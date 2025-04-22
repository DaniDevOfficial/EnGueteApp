import React from "react";
import {Box, HStack, Text} from "native-base";
import {DeleteUser} from "./DeleteUser";
import {Logout} from "./Logout";
import {useText} from "../../utility/TextKeys/TextKeys";

export function DangerZone() {


    return (
        <>
            <HStack alignItems="center" space={4} width={'90%'}>
                <Box flex={1} height="1px" bg="red.500" width={'10px'}/>
                <Text textAlign="center" color="red.500" fontWeight="bold" fontSize="xl">
                    {useText('dangerZone')}
                </Text>
                <Box flex={1} height="1px" bg="red.500"/>
            </HStack>
            <DeleteUser />
            <Logout />
        </>
    );
}
