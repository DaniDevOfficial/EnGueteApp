import React, {useEffect, useState} from "react";
import {Box, Text, IconButton, Popover, Button, HStack, CheckIcon, VStack} from "native-base";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {MemberActions} from "./MemberActions";

interface MemberCardProps {
    userId: string;
    username: string;
    userRoles: string[];
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
}

export function MemberCard({
                               userId,
                               username,
                               userRoles,
                               canKickUser,
                               canPromoteToAdmin,
                               canPromoteToManager,
                           }: MemberCardProps) {
    const hasActions = canKickUser || canPromoteToAdmin || canPromoteToManager;
    const [prettyRoles, setPrettyRoles] = useState<string[]>(userRoles);
    const text = useTexts(['member', 'admin', 'manager',])

    useEffect(() => {
        setPrettyRoles([]);
        userRoles.forEach((role) => {
            console.log(role)
            console.log(text)
            switch (role) {
                case "admin":
                    setPrettyRoles((prev) => [...prev, text.admin]);
                    break;
                case "manager":
                    setPrettyRoles((prev) => [...prev, text.manager]);
                    break;
                default:
                    setPrettyRoles((prev) => [...prev, text.member]);
            }
        })
    }, []);

    async function handleActionPress(action: string) {
        switch (action) {
            case "kick":
                // Handle kick action
                console.log(`Kicking user ${userId}`);
                break;
            case "promote_admin":
                // Handle promote to admin action
                console.log(`Promoting user ${userId} to admin`);
                break;
            case "demote_admin":
                // Handle demote from admin action
                console.log(`Demoting user ${userId} from admin`);
                break;
            case "promote_manager":
                // Handle promote to manager action
                console.log(`Promoting user ${userId} to manager`);
                break;
            case "demote_manager":
                // Handle demote from manager action
                console.log(`Demoting user ${userId} from manager`);
                break;
            default:
                console.log("Unknown action");
        }
    }

    return (
        <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding={3}
            borderBottomWidth={1}
            borderColor="gray.200"
        >
            <Box>
                <Text fontSize="lg" fontWeight="bold">
                    {username}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    {prettyRoles.join(", ")}
                </Text>
            </Box>

            {hasActions && (
                <Popover trigger={(triggerProps) => (
                    <IconButton
                        {...triggerProps}
                        icon={<CheckIcon size={20}/>}
                        borderRadius="full"
                        _icon={{color: "gray.600"}}
                        _pressed={{bg: "gray.200"}}
                        accessibilityLabel="More options"
                    />
                )}>
                    <Popover.Content accessibilityLabel="User Actions" w="56">
                        <Popover.Arrow/>
                        <Popover.CloseButton/>
                        <Popover.Header>Actions</Popover.Header>
                        <Popover.Body>
                            <MemberActions canKickUser={canKickUser} canPromoteToAdmin={canPromoteToAdmin}
                                           canPromoteToManager={canPromoteToManager} userRoles={userRoles} onActionPress={handleActionPress}/>
                        </Popover.Body>
                    </Popover.Content>
                </Popover>
            )}
        </Box>
    );
}
