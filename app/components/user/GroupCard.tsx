import React from 'react';
import {Group} from '../../repo/User';
import {Box, Flex, HStack, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

type GroupCardProps = {
    group: Group;
};


export function GroupCard({group}: GroupCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {
        // @ts-ignore
        navigation.navigate('group', {
            screen: 'groupDetails',
            params: {
                groupId: group.groupId,
            },
        });

    }


    return (
        <Pressable width={'100%'} onPress={handleNavigate}>
            <Box width={'100%'} alignItems="center" p="4" borderRadius="md" borderWidth={'1px'} borderColor={"coolGray.300"} my={2}>
                <Flex
                    flexDir={'column'}
                    width={'100%'}
                >
                    <HStack
                        justifyContent={'space-between'}

                    >
                        <Text
                            fontSize={'md'}
                            fontWeight={'bold'}
                        >
                            {group.groupName}
                        </Text>
                        <Ionicons name={'chevron-forward-outline'} size={20}/>

                    </HStack>
                    <Flex

                    >
                        <HStack
                            justifyContent={'space-between'}
                            space={6}
                        >

                            <HStack>
                                <Ionicons name={'person-outline'} size={20}/>
                                <Text>
                                    {group?.userCount.toString()}
                                </Text>
                            </HStack>
                            <HStack
                                space={2}
                            >
                                <Ionicons name={'time-outline'} size={20}/>
                                <Text>
                                    Soon
                                </Text>
                            </HStack>
                        </HStack>

                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}
