import React from "react";
import { Text, VStack, Divider, Pressable } from "native-base";
import {useTexts} from "../../utility/TextKeys/TextKeys";

interface MemberActionsProps {
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
    userRoles: string[];
    onActionPress: (action: string) => Promise<void>;
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
            action: isAdmin ? "demote_admin" : "promote_admin",
        });
    }

    if (canPromoteToManager && !isAdmin) {
        actions.push({
            label: isManager ? text.demoteManager : text.promoteToManager,
            action: isManager ? "demote_manager" : "promote_manager",
        });
    }

    if (canKickUser) {
        actions.push({ label: text.kickFromGroup, action: "kick" });
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
