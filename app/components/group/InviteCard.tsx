import React, {useState} from "react";
import {Box, Button, IconButton, Modal, Popover, Pressable, Text, useToast, VStack} from "native-base";
import {KebabIcon} from "../UI/Icons/KebabIcon";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {getFancyTimeDisplay} from "../../utility/Dates";
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import {showToast} from "../UI/Toast";
import {DeleteInviteToken} from "../../repo/group/Invites";

interface InviteCardProps {
    inviteToken: string;
    inviteLink: string;
    expiryDate: string;
    canVoid: boolean;
    onVoid: () => Promise<void>;
}

export function InviteCard({inviteToken, expiryDate, inviteLink, canVoid, onVoid}: InviteCardProps) {
    const text = useTexts(['voidToken', 'actions', 'expiresAt', 'copyLink', 'copiedLink', 'showQr', 'qrCode', 'close']);
    const toast = useToast();
    const [showQr, setShowQr] = useState(false);

    const actions = [

        {
            title: text.copyLink,
            action: copyLink,

        },
        {
            title: text.showQr,
            action: () => setShowQr(true),
        },
    ]

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
            console.log(e) //TODO: error handling
            showToast({
                toast,
                title: text.voidToken,
                description: text.voidToken,
                status: "error",
            })
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


            <Modal isOpen={showQr} onClose={() => setShowQr(false)}>
                <Modal.Content>
                    <Modal.Header>{text.qrCode}</Modal.Header>
                    <Modal.Body>
                        <Box display="flex" justifyContent="center" alignItems="center">

                            <QRCode value={inviteLink} size={200}/>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" onPress={() => setShowQr(false)}>
                            {text.close}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>
    );
}
