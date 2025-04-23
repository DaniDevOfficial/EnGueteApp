import React from "react";
import {Box, HStack, IconButton, Popover, Pressable, Text, VStack} from "native-base";
import {KebabIcon} from "../UI/Icons/KebabIcon";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {getFancyTimeDisplay, getSwissDateTimeDisplay} from "../../utility/Dates";

interface InviteCardProps {
    inviteToken: string;
    inviteLink: string;
    expiryDate: string;
    canVoid: boolean;
}

export function InviteCard({inviteToken, expiryDate, inviteLink, canVoid}: InviteCardProps) {
    const text = useTexts(['voidToken', 'actions', 'expiresAt'])

    async function voidToken() {

    }

    return (
        <>
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
                {canVoid ? (
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
                        <Popover.Content accessibilityLabel="User Actions" w="56">
                            <Popover.Arrow/>
                            <Popover.CloseButton/>
                            <Popover.Header>{text.actions}</Popover.Header>
                            <Popover.Body>
                                <Pressable onPress={voidToken}>
                                    {({isPressed}) => (
                                        <Text
                                            fontSize="sm"
                                            color={isPressed ? "primary.600" : "gray.700"}
                                            opacity={isPressed ? 0.8 : 1}
                                        >
                                            {text.voidToken}
                                        </Text>
                                    )}
                                </Pressable>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>
                ) : (
                    <Box>
                    </Box>
                )}
            </Box>
        </>

    );
}