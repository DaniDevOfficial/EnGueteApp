import React from "react";
import {HStack, Text, Box} from "native-base";

export function DangerZone() {
    return (
        <HStack alignItems="center" space={4} width={'90%'}>
            <Box flex={1} height="1px" bg="red.500" width={'10px'}/>
            <Text textAlign="center" color="red.500" fontWeight="bold" fontSize="xl" >
                Danger Zone
            </Text>
            <Box flex={1} height="1px" bg="red.500"/>
        </HStack>
    );
}
