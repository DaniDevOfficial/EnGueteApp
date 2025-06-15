import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, Icon, Image, ScrollView, useToast, VStack} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {updateUsername} from "../repo/settings/User";
import {LanguageSelector} from "../components/settings/LanguageSelector";
import {ThemeSelector} from "../components/settings/ThemeSelector";
import {DangerZone} from "../components/settings/DangerZone";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {UnauthorizedError, useErrorText} from "../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {showToast} from "../components/UI/Toast";
import {handleLogoutProcedure} from "../Util";


export function UserSettings() {
    const user = useUser();
    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');
    const text = useTexts(['updateUsername', 'userSettings', 'error']);
    const toast = useToast();
    const getError = useErrorText();
    const navigation = useNavigation();

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
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
        }
    }

    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.userSettings}/>

            <ScrollView>
                <VStack maxH={'100%'} flex={1} p={"10px 5px"} space={4}>

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
                    <TextUpdate text={user.user.userName} title={text.updateUsername}
                                onSuccess={handleEditUsername}/>

                    <LanguageSelector/>
                    <ThemeSelector/>
                    <DangerZone/>
                </VStack>
            </ScrollView>
        </>
    )
}