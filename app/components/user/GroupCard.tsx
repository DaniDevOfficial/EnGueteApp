import React from 'react';
import {Group} from '../../repo/User';
import {Box, Flex, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";

type GroupCardProps = {
    group: Group;
};

export function GroupCard({group}: GroupCardProps) {
    console.log(group)
    const navigation = useNavigation();

    function handleNavigate() {
        navigation.navigate('GroupDetails', {groupId: group.groupId});

    }


    return (
        <Pressable onPress={handleNavigate}>
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={"70%"} my={2}>
                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Box>
                        <Text>
                            {group.groupName}
                        </Text>
                    </Box>
                    <Box>

                        <Text>
                            {group.amountOfPeopleInGroup.toString()}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Pressable>
    );
}
