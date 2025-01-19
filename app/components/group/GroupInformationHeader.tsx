import React from 'react';
import {Box, Flex, Text} from 'native-base';
import {GroupInformation as GroupInformationType} from "../../repo/Group";

type GroupInformation = {
    groupInformation: GroupInformationType;
};

export function GroupInformationHeader({groupInformation}: GroupInformation) {

    return (
        <>
            <Box alignItems="center" width={"70%"} my={2}>
                <Flex
                    flexDir={'column'}
                    alignItems={"center"}
                    width={"100%"}
                >
                    <Box>
                        <Text>
                            GroupName: {groupInformation.groupName}
                        </Text>
                    </Box>
                    <Box>
                        <Text>
                            Amount of users: {groupInformation.userCount.toString()}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </>
    );
}
