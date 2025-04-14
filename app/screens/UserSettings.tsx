import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, Icon, Image, ScrollView, Select, Text, VStack} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useText} from "../utility/TextKeys/TextKeys";
import {updateUsername} from "../repo/settings/User";
import {LanguageSelector} from "../components/settings/LanguageSelector";
import {ThemeSelector} from "../components/settings/ThemeSelector";


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
            <ScrollView>
                <VStack maxH={'100%'} flex={1} alignItems="center" p={"10px 5px"} space={4}>

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
                    <TextUpdate text={user.user.userName} title={useText('updateUsername')}
                                onSuccess={handleEditUsername}/>

                    <LanguageSelector/>
                    <ThemeSelector/>
                </VStack>
            </ScrollView>
        </>
    )
}