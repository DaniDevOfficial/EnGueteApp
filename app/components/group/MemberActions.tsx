import React from "react";
import {Pressable, Text, View} from "react-native";
import {useTexts} from "../../utility/TextKeys/TextKeys";

interface MemberActionsProps {
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
    userRoles: string[];
    onActionPress: (action: string) => Promise<void>;
    onDone?: () => void;
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
                                  onDone,
                              }: MemberActionsProps) {
    const isAdmin = userRoles.includes("admin");
    const isManager = userRoles.includes("manager");
    const text = useTexts(['promoteAdmin', 'promoteToManager', 'demoteAdmin', 'demoteManager', 'kickFromGroup']);

    const actions: { label: string; action: string; destructive?: boolean }[] = [];

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
        actions.push({label: text.kickFromGroup, action: ACTIONS.KICK, destructive: true});
    }

    return (
        <View className="w-full gap-1">
            {actions.map(({label, action, destructive}, index) => (
                <Pressable
                    key={index}
                    className="rounded-lg px-3 py-3 active:bg-gray-100"
                    onPress={async () => {
                        await onActionPress(action);
                        onDone?.();
                    }}
                >
                    <Text className={`text-base ${destructive ? 'font-medium text-red-500' : 'text-gray-800'}`}>
                        {label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
