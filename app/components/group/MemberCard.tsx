import React, {useEffect, useState} from "react";
import {Box, IconButton, Popover, Text, useToast} from "native-base";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {ACTIONS, MemberActions} from "./MemberActions";
import {ChangeRole, KickUserFromGroup, KickUserRequest, RoleChange, RoleChangeRequest} from "../../repo/Group";
import {useGroup} from "../../context/groupContext";
import {KebabIcon} from "../UI/Icons/KebabIcon";
import {showToast} from "../UI/Toast";

interface MemberCardProps {
    userId: string;
    username: string;
    userRoles: string[];
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
    isCurrentUser: boolean;
}

export function MemberCard({
                               userId,
                               username,
                               userRoles,
                               canKickUser,
                               canPromoteToAdmin,
                               canPromoteToManager,
                               isCurrentUser,
                           }: MemberCardProps) {
    let hasActions = canKickUser || canPromoteToAdmin || canPromoteToManager;
    if (isCurrentUser) {
        hasActions = canPromoteToAdmin || canPromoteToManager;
    }
    const {group} = useGroup();
    const [prettyRoles, setPrettyRoles] = useState<string[]>([]);
    const text = useTexts(['member', 'admin', 'manager', 'actions', 'error', 'youAreNotAllowedToPerformThisAction'])

    const toast = useToast();

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
                case ACTIONS.KICK: {
                    const kickRequest: KickUserRequest = {groupId, userId};
                    await KickUserFromGroup(kickRequest);
                    console.log(`✅ User ${userId} was kicked from the group.`);
                    break;
                }
                case ACTIONS.PROMOTE_ADMIN:
                case ACTIONS.DEMOTE_ADMIN:
                case ACTIONS.PROMOTE_MANAGER:
                case ACTIONS.DEMOTE_MANAGER: {
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
            showToast({
                toast,
                title: text.error,
                description: text.youAreNotAllowedToPerformThisAction,
                status: 'error',
            })
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
                                canKickUser={canKickUser && !isCurrentUser}
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
