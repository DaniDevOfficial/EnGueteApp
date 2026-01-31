import {Box, HStack, Icon, Image, Input, Modal, Text, useToast, VStack} from "native-base";
import groupIcon from '../../assets/PopupIcons/groupIcon.png';
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import React, {useState} from "react";
import {CustomButton} from "../UI/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StackActions, useNavigation} from "@react-navigation/native";
import {CreateNewGroup, NewGroupType} from "../../repo/Group";
import {showToast} from "../UI/Toast";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";

export function CreateGroup() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState<string | undefined>();

    const text = useTexts(['createNewGroup', 'createNewGroupInformationText', 'groupName', 'error']);
    const navigation = useNavigation();
    const getError = useErrorText();
    const toast = useToast();

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

            <CustomButton onPress={() => setModalVisible(true)}>
                <HStack flexDir='row' space={2} justifyContent='space-between' alignItems='center'>
                    <Text color='white' fontWeight='bold' fontSize='xl'>
                        +
                    </Text>
                    <Text color='white'>
                        {text.createNewGroup}
                    </Text>
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
                                source={groupIcon}
                                alt="Profile picture"
                                width="170px"
                                height="150px"
                            />


                            <Text fontSize={'xl'} fontWeight='bold'>
                                {text.createNewGroup}
                            </Text>
                            <Text textAlign={'center'} fontSize={'md'} fontWeight={'light'}>
                                {text.createNewGroupInformationText}
                            </Text>
                            <Input
                                placeholder={text.groupName}
                                value={title}
                                onChangeText={setTitle}
                            />
                            <CustomButton width={'100%'} isLoading={isLoading} onPress={() => handleSubmit()}>
                                {useText('createNewGroup')}
                            </CustomButton>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}