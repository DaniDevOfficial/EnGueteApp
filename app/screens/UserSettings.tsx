import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, HStack, Icon, Image, Pressable, Select, Text} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {getText} from "../utility/TextKeys/TextKeys";
import {updateUsername} from "../repo/settings/User";
import {LanguageSelector} from "../components/settings/LanguageSelector";


export function UserSettings() {
    const user = useUser();
    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');

    function handleEditImage() {
    }

    async function handleEditUsername(newUsername: string) {
        try {
            const response = await updateUsername(newUsername)
            user.setUser({
                ...user.user,
                userName: newUsername,
            });

        } catch (e) {
            console.log(e.message)
        }
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

                    <TouchableOpacity onPress={handleEditImage}>
                        <Icon
                            as={Ionicons}
                            name="create-outline"
                            size={5}
                            color="black"
                            position="absolute"
                            bottom={0}
                            right={-15}
                        />
                    </TouchableOpacity>
                </Box>
                <TextUpdate text={user.user.userName} title={getText('updateUsername')} onSuccess={handleEditUsername}/>
                <LanguageSelector />

            </Box>
        </>
    )
}