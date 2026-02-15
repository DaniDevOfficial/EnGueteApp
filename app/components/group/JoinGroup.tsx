import {Box, HStack, Icon, Image, Input, Modal, Pressable, Text, useToast, VStack} from "native-base";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import React, {useState} from "react";
import {CustomButton} from "../UI/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StackActions, useNavigation} from "@react-navigation/native";
import {CreateNewGroup, NewGroupType} from "../../repo/Group";
import {showToast} from "../UI/Toast";
import {FRONTEND_ERRORS, UnauthorizedError, useErrorText} from "../../utility/Errors";
import inviteIcon from "../../assets/PopupIcons/inviteIcon.png";
import {handleLogoutProcedure} from "../../Util";

import {handleJoiningGroup} from "../Utility/JoinGroupPopup";
import {JoinGroupWithToken} from "../../repo/group/Invites";

export function JoinGroup() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [token, setToken] = useState<string | undefined>();

    const text = useTexts(['joinGroup', 'joinGroupInfoText', 'inviteToken', 'error']);
    const navigation = useNavigation();
    const getError = useErrorText();
    const toast = useToast();

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
        setLoading(false);

    }

    return (
        <>

            <CustomButton onlyOutline={true} onPress={() => setModalVisible(true)} >
                <HStack flexDir='row' space={2} justifyContent='center' alignItems='center'>
                    <Pressable>
                        <Icon
                            as={<Ionicons name="enter-outline"/>}
                            size={6}
                            color="orange.500"
                        />
                    </Pressable>
                </HStack>
            </CustomButton>


            <Modal
                _backdrop={{
                    bg: "coolGray.900", // backdrop color
                    opacity: 0.6,       // makes it see-through

                }}
                isOpen={isModalVisible}
                onClose={() => setModalVisible(false)}
            >
                <Modal.Content borderRadius={'xl'}>

                    <Modal.Body width='100%' p={'5'}>
                        <Icon
                            as={<Ionicons name="close"/>}
                            size={7}
                            position={'absolute'}
                            top={'5%'}
                            right={'5%'}
                            color="gray.400"
                            onPress={() => setModalVisible(false)}
                        />

                        <VStack
                            height='auto'
                            width={'100%'}
                            justifyContent={'center'}
                            alignItems='center'
                            space={'3'}
                        >

                            <Image
                                source={inviteIcon}
                                alt="inviteIcon"
                                width="100px"
                                height="110px"
                            />


                            <Text fontSize={'xl'} fontWeight='bold'>
                                {text.joinGroup}
                            </Text>
                            <Text textAlign={'center'} fontSize={'md'} fontWeight={'light'}>
                                {text.joinGroupInfoText}
                            </Text>
                            <Input
                                placeholder={text.inviteToken}
                                value={token}
                                onChangeText={setToken}
                            />
                            <CustomButton width={'100%'} isLoading={isLoading} onPress={() => handleJoin()}>
                                {text.joinGroup}
                            </CustomButton>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}