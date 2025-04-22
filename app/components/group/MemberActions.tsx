import React from "react";
import {Divider, Pressable, Text, VStack} from "native-base";
import {useTexts} from "../../utility/TextKeys/TextKeys";

interface MemberActionsProps {
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
    userRoles: string[];
    onActionPress: (action: string) => Promise<void>;
}

export const ACTIONS = {
    KICK: "kick",
    PROMOTE_ADMIN: "promote_admin",
    DEMOTE_ADMIN: "demote_admin",
    PROMOTE_MANAGER: "promote_manager",
    DEMOTE_MANAGER: "demote_manager",
}

export function MemberActions({
                                  canKickUser,
                                  canPromoteToAdmin,
                                  canPromoteToManager,
                                  userRoles,
                                  onActionPress,
                              }: MemberActionsProps) {
    const isAdmin = userRoles.includes("admin");
    const isManager = userRoles.includes("manager");
    const text = useTexts(['promoteAdmin', 'promoteToManager', 'demoteAdmin', 'demoteManager', 'kickFromGroup']);

    const actions: { label: string; action: string }[] = [];

    if (canPromoteToAdmin) {
        actions.push({
            label: isAdmin ? text.demoteAdmin : text.promoteAdmin,
            action: isAdmin ? ACTIONS.DEMOTE_ADMIN : ACTIONS.PROMOTE_ADMIN,
        });
    }

    if (canPromoteToManager && !isAdmin) {
        actions.push({
            label: isManager ? text.demoteManager : text.promoteToManager,
            action: isManager ? ACTIONS.DEMOTE_MANAGER : ACTIONS.PROMOTE_MANAGER,
        });
    }

    if (canKickUser) {
        actions.push({ label: text.kickFromGroup, action: ACTIONS.KICK });
    }

    return (
        <VStack space={2} divider={<Divider />}>
             {actions.map(({ label, action }, index) => (
                <Pressable key={index} onPress={() => onActionPress(action)}>
                    {({ isPressed }) => (
                        <Text
                            fontSize="sm"
                            color={isPressed ? "primary.600" : "gray.700"}
                            opacity={isPressed ? 0.8 : 1}
                        >
                            {label}
                        </Text>
                    )}
                </Pressable>
            ))}
        </VStack>
    );
}
