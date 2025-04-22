import React, {useEffect, useState} from "react";
import {Box, CheckIcon, IconButton, Popover, Text} from "native-base";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {MemberActions} from "./MemberActions";
import {ChangeRole, KickUserFromGroup, KickUserRequest, RoleChange, RoleChangeRequest} from "../../repo/Group";
import {useGroup} from "../../context/groupContext";
import {KebabIcon} from "../UI/Icons/KebabIcon";
import {CanPerformAction, PERMISSIONS} from "../../utility/Roles";

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
    const {group} = useGroup();
    const [prettyRoles, setPrettyRoles] = useState<string[]>([]);
    const text = useTexts(['member', 'admin', 'manager', 'actions'])

    useEffect(() => {
        setPrettyRoles([]);
        const tmpRoles: string[] = [];
        userRoles.forEach((role) => {
            switch (role) {
                case "admin":
                    tmpRoles.push(text.admin);
                    break;
                case "manager":
                    tmpRoles.push(text.manager);
                    break;
                default:
                    tmpRoles.push(text.member);
            }
        })
        setPrettyRoles(tmpRoles);
    }, []);

    async function handleActionPress(action: string) {
        try {
            const groupId = group.groupId;

            switch (action) {
                case "kick": {
                    const kickRequest: KickUserRequest = {groupId, userId};
                    await KickUserFromGroup(kickRequest);
                    console.log(`✅ User ${userId} was kicked from the group.`);
                    break;
                }
                case "promote_admin":
                case "demote_admin":
                case "promote_manager":
                case "demote_manager": {
                    const role = action.includes("admin") ? "admin" : "manager";
                    const isPromotion = action.includes("promote");

                    const changeRole: RoleChangeRequest = {
                        groupId,
                        userId,
                        role,
                    };

                    await ChangeRole(changeRole, isPromotion ? RoleChange.PROMOTION : RoleChange.DEMOTION);
                    console.log(`✅ ${isPromotion ? "Promoted" : "Demoted"} user ${userId} ${isPromotion ? "to" : "from"} ${role}.`);
                    break;
                }
            }
        } catch (error) {
            console.error(`❌ Failed to handle action "${action}" for user ${userId}:`, error);
            // Optionally: show some user-facing error here
        }
    }

    return (
        <Box
            flexDirection="row"
            justifyContent="space-between"
            padding={3}
            borderBottomWidth={1}
            borderColor="gray.200"
            width={'80%'}
        >
            <Box>
                <Text fontSize="lg" fontWeight="bold">
                    {username}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    {prettyRoles.join(", ")}
                </Text>
            </Box>

            {hasActions ? (
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
                            <MemberActions
                                canKickUser={canKickUser}
                                canPromoteToAdmin={canPromoteToAdmin}
                                canPromoteToManager={canPromoteToManager}
                                userRoles={userRoles}
                                onActionPress={handleActionPress}/>
                        </Popover.Body>
                    </Popover.Content>
                </Popover>
            ) : (
                <Box>
                </Box>
            )}

        </Box>
    );
}
