import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Group} from '../../repo/User';
import {useNavigation} from "@react-navigation/native";
import eatIcon from "../../assets/icons/eatIcon.png";
import arrowGoOn from '../../assets/icons/arrow-up-right.png';
import backgroundWithHeart from '../../assets/background/plateWithHeart.png';
import {ProfilePictureList} from "../Ui/ProfilePictureList";
import {PillTag} from "../Ui/Pilltag";

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

    const images = [];
    for (let i = 0; i < group.userCount; i++) {
        images.push('https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png')
    }

    return (
        <View className="p-2">
            <Pressable onPress={handleNavigate}>
                <View
                    className="w-full overflow-hidden rounded-[20px] px-4 py-5 shadow-sm"
                    style={{backgroundColor: color === 'orange' ? '#FFDAC2' : '#FFEAAD'}}
                >
                    <Image
                        source={backgroundWithHeart}
                        accessibilityLabel="backgroundWithHeart"
                        className="absolute bottom-0 right-0 z-0 h-[160px] w-[200px]"
                        resizeMode="contain"
                    />

                    <View className="z-10 flex-row justify-between">
                        <View className="max-w-[240px] items-start justify-center gap-3">
                            <View className="rounded-full bg-white p-2">
                                <Image
                                    className="h-[35px] w-[35px]"
                                    source={eatIcon}
                                    accessibilityLabel="eatIcon"
                                    resizeMode="contain"
                                />
                            </View>

                            <View className="px-2">
                                <Text className="text-base text-black">
                                    Home
                                </Text>
                                <Text className="text-xl font-bold text-black">
                                    {group.groupName}
                                </Text>
                            </View>

                            <ProfilePictureList
                                profilePictures={images}
                                totalAmount={group.userCount}
                            />
                        </View>

                        <View className="items-end justify-between">
                            <PillTag text={'Soon'} colorScheme={'orange'}/>

                            <View className="rounded-full bg-white p-3">
                                <Image
                                    className="h-[25px] w-[25px]"
                                    source={arrowGoOn}
                                    accessibilityLabel="arrowGoOn"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}
