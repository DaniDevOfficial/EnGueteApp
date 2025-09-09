import React from 'react';
import {Group} from '../../repo/User';
import {Box, Flex, HStack, Image, Pressable, Text, VStack} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import eatIcon from "../../assets/icons/eatIcon.png";

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
        <Box p={2}>

            <Pressable onPress={handleNavigate}>
                <Box
                    width="100%"
                    backgroundColor="#EDEDED"
                    padding={4}
                    px={3}
                    shadow={1}
                    borderRadius={10}
                >
                    <HStack>
                        <VStack
                            space={3}
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            {/** Icon */}
                            <Box
                                padding={'8px'}
                                backgroundColor={'white'}
                                borderRadius="100"
                            >

                                <Image
                                    w={'25px'}
                                    h={'25px'}
                                    source={eatIcon}
                                    alt="eatIcon"
                                    resizeMode="contain"
                                />
                            </Box>
                            {/** Name And Group Type */}
                            <Box paddingX={4}>

                            <Box>
                                <Text
                                    fontSize={16}
                                >
                                    Home
                                </Text>
                                <Text
                                    fontSize={20}
                                    fontWeight={'bold'}
                                >
                                    {group.groupName}
                                </Text>
                            </Box>
                            {/** Users in group image */}
                            </Box>

                        </VStack>

                    </HStack>
                </Box>
            </Pressable>


            <Pressable width={'100%'} onPress={handleNavigate}>
                <Box width={'100%'} alignItems="center" p="4" borderRadius="md" borderWidth={'1px'}
                     borderColor={"coolGray.300"} my={2}>
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
        </Box>

    );
}


function profilePictureList({profilePictures, totalAmount = null}: {profilePictures: number[], totalAmount: number|null}) {


    return (
        <Box>

        </Box>
    )
}