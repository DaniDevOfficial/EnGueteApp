import React, {useState} from "react";
import {
    Box,
    Icon,
    IconButton,
    Image,
    Input,
    Modal,
    Popover,
    Pressable,
    Text,
    useToast,
    VStack
} from "native-base";
import {KebabIcon} from "../UI/Icons/KebabIcon";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {getFancyTimeDisplay} from "../../utility/Dates";
import * as Clipboard from 'expo-clipboard';
import {showToast} from "../UI/Toast";
import {DeleteInviteToken} from "../../repo/group/Invites";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {resetToUserScreen} from "../../utility/navigation";
import {useNavigation} from "@react-navigation/native";
import {CustomButton} from "../UI/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";

interface InviteCardProps {
    inviteToken: string;
    inviteLink: string;
    expiryDate: string;
    canVoid: boolean;
    onVoid: () => Promise<void>;
}

export function InviteCard({inviteToken, expiryDate, inviteLink, canVoid, onVoid}: InviteCardProps) {
    const text = useTexts(['voidToken', 'actions', 'expiresAt', 'copyLink', 'copiedLink', 'showInformation', 'qrCode', 'close', 'invitation', 'shareInvitationLink']);
    const toast = useToast();
    const navigation = useNavigation();
    const getError = useErrorText();

    const [showInformation, setShowInformation] = useState(false);

    const actions = [
        {
            title: text.showInformation,
            action: () => setShowInformation(true),
        },
    ];

    if (canVoid) {
        actions.push({
            title: text.voidToken,
            action: voidToken,
        })
    }

    async function voidToken() {
        try {
            await DeleteInviteToken(inviteToken);
            await onVoid();
            showToast({
                toast,
                title: text.voidToken,
                description: text.voidToken,
                status: "success",
            })
        } catch (e) {

            showToast({
                toast,
                title: text.voidToken,
                description: getError(e.message),
                status: "error",
            });

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                return;
            }
        }
    }

    async function copyLink() {
        await Clipboard.setStringAsync(inviteLink);
        showToast({
            toast,
            title: text.copiedLink,
            description: text.copiedLink,
            status: "success",
        })
    }

    return (
        <Box
            flexDirection="row"
            justifyContent="space-between"
            padding={3}
            borderBottomWidth={1}
            borderColor="gray.200"
        >
            <VStack w={'90%'}>
                <Text fontSize={'sm'} isTruncated>
                    {inviteToken}
                </Text>
                <Text fontSize={'sm'} color="gray.500" isTruncated>
                    {text.expiresAt}: {getFancyTimeDisplay(expiryDate)}
                </Text>
            </VStack>

            <Popover trigger={(triggerProps) => (
                <IconButton
                    {...triggerProps}
                    icon={<KebabIcon size={5}/>}
                    borderRadius="full"
                    _icon={{color: "gray.600"}}
                    _pressed={{bg: "gray.200"}}
                    accessibilityLabel="More options"
                />
            )}>
                <Popover.Content accessibilityLabel="User Actions" w="64">
                    <Popover.Arrow/>
                    <Popover.CloseButton/>
                    <Popover.Header>{text.actions}</Popover.Header>
                    <Popover.Body>
                        <VStack space={2}>
                            {actions.map((action, index) => (
                                <Pressable key={index} onPress={action.action}>
                                    {({isPressed}) => (
                                        <Text
                                            fontSize="sm"
                                            color={isPressed ? "primary.600" : "gray.700"}
                                            opacity={isPressed ? 0.8 : 1}
                                        >
                                            {action.title}
                                        </Text>
                                    )}
                                </Pressable>
                            ))}
                        </VStack>
                    </Popover.Body>
                </Popover.Content>
            </Popover>


            <Modal isOpen={showInformation} onClose={() => setShowInformation(false)}>
                <Modal.Content>
                    <Modal.Body width='100%' p={'5'}>
                        <Icon
                            as={<Ionicons name="close"/>}
                            size={7}
                            position={'absolute'}
                            top={'5%'}
                            right={'5%'}
                            color="gray.400"
                            onPress={() => setShowInformation(false)}
                        />
                        <VStack space={2}>


                            <VStack
                                height='auto'
                                width={'100%'}
                                justifyContent={'center'}
                                alignItems='center'
                                space={'3'}
                            >


                                <Text fontSize={'xl'} fontWeight='bold'>
                                    {text.invitation}
                                </Text>
                                <Text textAlign={'center'} fontSize={'md'} fontWeight={'light'}>
                                    {text.shareInvitationLink}
                                </Text>

                                <Box display="block" justifyContent="center" alignItems="center">
                                    <QRCode value={inviteLink} size={100}/>
                                </Box>
                                <Input
                                    value={inviteLink}
                                />
                            </VStack>


                            <CustomButton width={'100%'} onPress={copyLink}>
                                {text.copyLink}
                            </CustomButton>
                            <Text fontSize={'sm'} color="gray.500" textAlign={'center'} isTruncated>
                                {getFancyTimeDisplay(expiryDate)}
                            </Text>
                        </VStack>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
}
