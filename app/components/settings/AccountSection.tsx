import {Box, Icon, Image, useToast, VStack, Text} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TextUpdate} from "./TextUpdate";
import React, {useState} from "react";
import {useUser} from "../../context/userContext";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {updateUsername} from "../../repo/settings/User";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";
import {Option, SettingsSectionStack} from "../UI/SettingSectionStack";
import {TextModalUpdate} from "./TextModalUpdate";
import {PasswordModalUpdate} from "./PasswordModalUpdate";

export function AccountSection() {
    const user = useUser();
    const text = useTexts(['updateUsername', 'userSettings', 'error', 'username', 'account', 'email', 'password']);
    const toast = useToast();
    const getError = useErrorText();
    const navigation = useNavigation();

    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');
    const [editUsernameModalOpen, setEditUsernameModalOpen] = useState<boolean>(false);
    const [editPasswordModalOpen, setEditPasswordModalOpen] = useState<boolean>(false);

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

    async function handleEditPassword(oldPassword: string, newPassword: string) {

    }

    const options: Option[] = [
        {
            label: text.username,
            onPress: () => {
                setEditUsernameModalOpen(true);
            },
            icon: 'person-outline'
        },
        {
            label: text.email,
            onPress: () => {
            },
            icon: 'mail-outline'
        },
        {
            label: text.password,
            onPress: () => {
                setEditPasswordModalOpen(true);
            },
            icon: 'lock-closed-outline'
        }

    ];
    console.log(user.user)

    return (
        <>
            <VStack
                space={10}
            >
                <VStack
                    justifyContent="center"
                    alignItems="center"
                    space={2}
                >

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
                    <Text
                        fontSize={'xl'}
                        fontWeight={'bold'}
                    >
                        {user.user.userName}
                    </Text>
                    <Text
                        fontSize={'sm'}
                        color={'gray.500'}
                    >
                        {user.user.email.trim() !== '' ? user.user.email : 'No email provided'}
                    </Text>
                </VStack>

                <SettingsSectionStack title={text.account} options={options}/>
                <TextModalUpdate
                    text={user.user.userName}
                    title={text.updateUsername}
                    isOpen={editUsernameModalOpen}
                    onClose={() => setEditUsernameModalOpen(false)}
                    onSuccess={handleEditUsername}
                />
                <PasswordModalUpdate
                    text={user.user.userName}
                    title={text.updateUsername}
                    isOpen={editPasswordModalOpen}
                    onClose={() => setEditPasswordModalOpen(false)}
                    onSuccess={handleEditPassword}
                />
            </VStack>
        </>
    )
}