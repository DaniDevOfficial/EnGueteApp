import React, {useState} from "react";
import {ActivityIndicator, Image, Modal, Pressable, Text, TextInput, View} from "react-native";
import groupIcon from '../../assets/PopupIcons/groupIcon.png';
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StackActions, useNavigation} from "@react-navigation/native";
import {CreateNewGroup, NewGroupType} from "../../repo/Group";
import {showToast} from "../Ui/Toast";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";

export function CreateGroup() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState<string | undefined>();

    const text = useTexts(['createNewGroup', 'createNewGroupInformationText', 'groupName', 'error']);
    const createLabel = useText('createNewGroup');
    const navigation = useNavigation();
    const getError = useErrorText();

    async function handleSubmit() {
        setLoading(true);
        try {
            const data: NewGroupType = {
                // @ts-ignore
                groupName: title,
            }
            const res = await CreateNewGroup(data)

            // @ts-ignore
            navigation.dispatch(
                StackActions.replace('group', {
                    screen: 'groupDetails',
                    params: {
                        groupId: res.groupId,
                    },
                })
            );
            return;
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
                className="items-center justify-center rounded-[30px] bg-app-orange px-4 py-2 active:opacity-60"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-xl font-bold text-white">
                    {' '} + {' '}
                </Text>
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
                                source={groupIcon}
                                accessibilityLabel="group icon"
                                className="h-[150px] w-[170px]"
                                resizeMode="contain"
                            />

                            <Text className="text-xl font-bold text-black">
                                {text.createNewGroup}
                            </Text>
                            <Text className="text-center text-base font-light text-black">
                                {text.createNewGroupInformationText}
                            </Text>
                            <TextInput
                                placeholder={text.groupName}
                                value={title}
                                onChangeText={setTitle}
                                className="w-full rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff"/>
                                ) : (
                                    <Text className="text-base font-medium text-white">
                                        {createLabel}
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
