import React, {useState} from 'react';
import {UserCard as UserCardType} from '../../repo/User';
import {Box, Image, Text} from 'native-base';
import {useText} from "../../utility/TextKeys/TextKeys";
import {getGreetingBasedOnTime} from "../../utility/Dates";

type UserCardProps = {
    user: UserCardType;
};

export function UserCard({ user }: UserCardProps) {
    const [imageSrc, setImageSrc] = useState(user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');

    return (
        <Box alignItems="center" p="4" borderRadius="md">
            <Image
                source={{ uri: imageSrc }}
                alt="Profile picture"
                onError={() =>
                    setImageSrc('https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png')
                }
                width={"70px"}
                height={"70px"}
                borderRadius="full"
            />
            <Text fontSize="lg" mt="4" bold>
                {useText('welcomeBackUsername', {username: user.userName, timeOfDay: useText(getGreetingBasedOnTime())})}
            </Text>
        </Box>
    );
}
