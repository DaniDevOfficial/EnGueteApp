import React from 'react';
import {Group} from '../../repo/User';
import {Box, Flex, HStack, Image, Pressable, Text, VStack} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import eatIcon from "../../assets/icons/eatIcon.png";
import arrowGoOn from '../../assets/icons/arrow-up-right.png';
import backgroundWithHeart from '../../assets/background/plateWithHeart.png';

import {ProfilePictureList} from "../UI/ProfilePictureList";
import {PillTag} from "../UI/Pilltag";
import {green} from "react-native-reanimated/lib/typescript/Colors";

type GroupCardProps = {
    group: Group;
    color: 'orange' | 'yellow';
};


export function GroupCard({group, color}: GroupCardProps) {
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


    const iconSize = '35px';
    const iconSizeSmoll = '25px';
    const images = [];

    for (let i = 0; i < group.userCount; i++) {
        images.push('https://i0.wp.com/picjumbo.com/wp-content/uploads/palm-tree-and-sky-in-early-evening-free-image.jpg?w=600&quality=80')
    }


    return (
        <Box p={2}>

            <Pressable onPress={handleNavigate}>
                <Box
                    width="100%"
                    backgroundColor={color === 'orange' ? "#FFDAC2" : '#FFEAAD'}
                    padding={5}
                    px={4}
                    shadow={1}
                    borderRadius={20}
                    overflow="hidden"

                >
                    <Image
                        source={backgroundWithHeart}
                        alt="backgroundWithHeart"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: -60,
                            width: '100%',
                            height: '90%',
                            zIndex: -1,
                        }}
                        resizeMode="contain"
                    />

                    <HStack  justifyContent="space-between">
                        <VStack
                            space={3}
                            maxW={'240px'}
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
                                    w={iconSize}
                                    h={iconSize}
                                    source={eatIcon}
                                    alt="eatIcon"
                                    resizeMode="contain"
                                />
                            </Box>
                            {/** Name And Group Type */}
                            <Box paddingX={2}>

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
                            </Box>
                            {/** Users in group image */}
                            <ProfilePictureList
                                profilePictures={images}
                                totalAmount={group.userCount}/>

                        </VStack>

                        <VStack justifyContent="space-between" alignItems="flex-end">

                            <PillTag text={'Soon'} colorScheme={'orange'} />

                            <Box
                                padding={'12px'}
                                backgroundColor={'white'}
                                borderRadius="100"
                            >

                                <Image
                                    w={iconSizeSmoll}
                                    h={iconSizeSmoll}
                                    source={arrowGoOn}
                                    alt="arrowGoOn"
                                    resizeMode="contain"
                                />
                            </Box>
                        </VStack>

                    </HStack>

                </Box>
            </Pressable>
        </Box>

    );
}


