import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {UserCard as UserCardType} from '../../repo/User';
import {useText} from "../../utility/TextKeys/TextKeys";
import {getGreetingBasedOnTime} from "../../utility/Dates";

const PLACEHOLDER_AVATAR =
    'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png';

type UserCardProps = {
    user: UserCardType;
};

export function UserCard({user}: UserCardProps) {
    const [imageSrc, setImageSrc] = useState(user.profilePicture || PLACEHOLDER_AVATAR);

    return (
        <View className="items-center rounded-md p-4">
            <Image
                source={{uri: imageSrc}}
                accessibilityLabel="Profile picture"
                onError={() => setImageSrc(PLACEHOLDER_AVATAR)}
                className="h-[70px] w-[70px] rounded-full"
            />
            <Text className="mt-4 text-lg font-bold text-black">
                {useText('welcomeBackUsername', {
                    username: user.userName,
                    timeOfDay: useText(getGreetingBasedOnTime()),
                })}
            </Text>
        </View>
    );
}
