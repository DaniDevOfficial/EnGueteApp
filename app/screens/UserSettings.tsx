import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, HStack, Icon, Image, Pressable, Text} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";


export function UserSettings() {
    const user = useUser();
    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');

    function handleEditImage() {
    }


    return (
        <>
            <BackButton/>
            <Box flex={1} alignItems="center" p={"10px 5px"}>
                <Box position="relative" width="70px" height="70px">
                    <Image
                        source={{uri: imageSrc}}
                        alt="Profile picture"
                        onError={() =>
                            setImageSrc(
                                "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png"
                            )
                        }
                        width="70px"
                        height="70px"
                        borderRadius="full"
                    />

                    <Pressable onPress={handleEditImage}>
                        <Icon
                            as={Ionicons}
                            name="create-outline"
                            size={5}
                            color="black"
                            position="absolute"
                            bottom={0}
                            right={-15}
                        />
                    </Pressable>
                </Box>
                <HStack alignItems="center" space={4} mt={4} mb={2}>
                    <Text fontSize="xl" fontWeight="bold">
                        {user.user.userName}
                    </Text>
                    <Pressable onPress={() => console.log('yayyy')}>
                        <Icon as={Ionicons} name="create-outline" size={6} color="black"/>
                    </Pressable>
                </HStack>


            </Box>
        </>
    )
}