import React, {useState} from "react";
import {ActivityIndicator, Image, Modal, Pressable, Text, TextInput, View} from "react-native";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StackActions, useNavigation} from "@react-navigation/native";
import {showToast} from "../Ui/Toast";
import {FRONTEND_ERRORS, UnauthorizedError, useErrorText} from "../../utility/Errors";
import inviteIcon from "../../assets/PopupIcons/inviteIcon.png";
import {handleLogoutProcedure} from "../../Util";
import {JoinGroupWithToken} from "../../repo/group/Invites";

export function JoinGroup() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [token, setToken] = useState<string | undefined>();

    const text = useTexts(['joinGroup', 'joinGroupInfoText', 'inviteToken', 'error']);
    const navigation = useNavigation();
    const getError = useErrorText();

    async function handleJoin() {
        setLoading(true);
        try {
            if (token === undefined) {
                throw new Error(FRONTEND_ERRORS.INVALID_INVITE_TOKEN_ERROR);
            }

            const response = await JoinGroupWithToken(token);

            // @ts-ignore
            navigation.dispatch(
                StackActions.replace('group', {
                    screen: 'groupDetails',
                    params: {
                        groupId: response.groupId,
                    },
                })
            );
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
        setLoading(false);
    }

    return (
        <>
            <Pressable
                className="items-center justify-center rounded-[30px] border border-app-orange bg-white px-3 py-2 active:opacity-60"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="enter-outline" size={24} color="#f97316"/>
            </Pressable>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 items-center justify-center bg-black/60 px-6">
                    <View className="w-full max-w-md rounded-xl bg-white p-5">
                        <Pressable
                            className="absolute right-[5%] top-[5%] z-10"
                            onPress={() => setModalVisible(false)}
                            hitSlop={8}
                        >
                            <Ionicons name="close" size={28} color="#9ca3af"/>
                        </Pressable>

                        <View className="w-full items-center justify-center gap-3">
                            <Image
                                source={inviteIcon}
                                accessibilityLabel="inviteIcon"
                                className="h-[110px] w-[100px]"
                                resizeMode="contain"
                            />

                            <Text className="text-xl font-bold text-black">
                                {text.joinGroup}
                            </Text>
                            <Text className="text-center text-base font-light text-black">
                                {text.joinGroupInfoText}
                            </Text>
                            <TextInput
                                placeholder={text.inviteToken}
                                value={token}
                                onChangeText={setToken}
                                className="w-full rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                                onPress={handleJoin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff"/>
                                ) : (
                                    <Text className="text-base font-medium text-white">
                                        {text.joinGroup}
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}
