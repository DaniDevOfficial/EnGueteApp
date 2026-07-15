import React, {useState} from "react";
import {Image, Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useUser} from "../../context/userContext";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {updateUsername} from "../../repo/settings/User";
import {showToast} from "../Ui/Toast";
import {handleLogoutProcedure} from "../../Util";
import {Option, SettingsSectionStack} from "../Ui/SettingSectionStack";
import {TextModalUpdate} from "./TextModalUpdate";
import {PasswordModalUpdate} from "./PasswordModalUpdate";

const PLACEHOLDER_AVATAR =
    "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png";

export function AccountSection() {
    const user = useUser();
    const text = useTexts(['updateUsername', 'userSettings', 'error', 'username', 'account', 'email', 'password']);
    const getError = useErrorText();
    const navigation = useNavigation();

    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || PLACEHOLDER_AVATAR);
    const [editUsernameModalOpen, setEditUsernameModalOpen] = useState(false);
    const [editPasswordModalOpen, setEditPasswordModalOpen] = useState(false);

    function handleEditImage() {
    }

    async function handleEditUsername(newUsername: string) {
        try {
            await updateUsername(newUsername)
            user.setUser({
                ...user.user,
                userName: newUsername,
            });
        } catch (e) {
            showToast({
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

    async function handleEditPassword(_oldPassword: string, _newPassword: string) {
    }

    const options: Option[] = [
        {
            label: text.username,
            onPress: () => setEditUsernameModalOpen(true),
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
            onPress: () => setEditPasswordModalOpen(true),
            icon: 'lock-outline'
        }
    ];

    return (
        <View className="gap-10">
            <View className="items-center justify-center gap-2">
                <View className="relative h-[70px] w-[70px]">
                    <Image
                        source={{uri: imageSrc}}
                        accessibilityLabel="Profile picture"
                        onError={() => setImageSrc(PLACEHOLDER_AVATAR)}
                        className="h-[70px] w-[70px] rounded-full"
                    />
                    <Pressable
                        onPress={handleEditImage}
                        className="absolute -right-3 bottom-0"
                        hitSlop={8}
                    >
                        <Ionicons name="create-outline" size={20} color="black"/>
                    </Pressable>
                </View>
                <Text className="text-xl font-bold text-black">
                    {user.user.userName}
                </Text>
                <Text className="text-sm text-gray-500">
                    {user.user.email.trim() !== '' ? user.user.email : 'No email provided'}
                </Text>
            </View>

            <SettingsSectionStack title={text.account} options={options}/>

            <TextModalUpdate
                initialValue={user.user.userName}
                title={text.updateUsername}
                isOpen={editUsernameModalOpen}
                onClose={() => setEditUsernameModalOpen(false)}
                onSuccess={handleEditUsername}
            />

            <PasswordModalUpdate
                isOpen={editPasswordModalOpen}
                onClose={() => setEditPasswordModalOpen(false)}
                onSuccess={handleEditPassword}
            />
        </View>
    )
}
