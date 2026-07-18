import React, {useEffect, useState} from "react";
import {Modal, Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {ACTIONS, MemberActions} from "./MemberActions";
import {ChangeRole, KickUserFromGroup, KickUserRequest, RoleChange, RoleChangeRequest} from "../../repo/Group";
import {useGroup} from "../../context/groupContext";
import {showToast} from "../Ui/Toast";
import {colors} from "../../theme/colors";

interface MemberCardProps {
    userId: string;
    username: string;
    userRoles: string[];
    canKickUser: boolean;
    canPromoteToAdmin: boolean;
    canPromoteToManager: boolean;
    isCurrentUser: boolean;
    onChanged?: () => Promise<void>;
}

const ROLE_STYLES: Record<string, { bg: string; text: string }> = {
    admin: {bg: colors.brand.orangeMuted, text: colors.brand.orange},
    manager: {bg: colors.status.infoSoft, text: colors.status.info},
    member: {bg: colors.surface.muted, text: colors.ink.muted},
};

export function MemberCard({
                               userId,
                               username,
                               userRoles,
                               canKickUser,
                               canPromoteToAdmin,
                               canPromoteToManager,
                               isCurrentUser,
                               onChanged,
                           }: MemberCardProps) {
    let hasActions = canKickUser || canPromoteToAdmin || canPromoteToManager;
    if (isCurrentUser) {
        hasActions = canPromoteToAdmin || canPromoteToManager;
    }
    const {group} = useGroup();
    const [prettyRoles, setPrettyRoles] = useState<{ key: string; label: string }[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const text = useTexts(['member', 'admin', 'manager', 'actions', 'error', 'youAreNotAllowedToPerformThisAction'])

    useEffect(() => {
        const tmpRoles: { key: string; label: string }[] = [];
        userRoles.forEach((role) => {
            switch (role) {
                case "admin":
                    tmpRoles.push({key: 'admin', label: text.admin});
                    break;
                case "manager":
                    tmpRoles.push({key: 'manager', label: text.manager});
                    break;
                default:
                    tmpRoles.push({key: 'member', label: text.member});
            }
        })
        setPrettyRoles(tmpRoles.length ? tmpRoles : [{key: 'member', label: text.member}]);
    }, [userRoles]);

    async function handleActionPress(action: string) {
        try {
            const groupId = group.groupId;

            switch (action) {
                case ACTIONS.KICK: {
                    const kickRequest: KickUserRequest = {groupId, userId};
                    await KickUserFromGroup(kickRequest);
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
                    break;
                }
            }
            await onChanged?.();
        } catch (error) {
            showToast({
                title: text.error,
                description: text.youAreNotAllowedToPerformThisAction,
                status: 'error',
            })
        }
    }

    const initial = (username?.trim()?.[0] || '?').toUpperCase();

    return (
        <>
            <View className="w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Text className="text-lg font-bold text-orange-700">{initial}</Text>
                </View>

                <View className="flex-1">
                    <View className="mb-1 flex-row flex-wrap items-center gap-2">
                        <Text className="text-base font-bold text-black" numberOfLines={1}>
                            {username}
                        </Text>
                        {isCurrentUser && (
                            <View className="rounded-full bg-orange-100 px-2 py-0.5">
                                <Text className="text-xs font-semibold text-orange-700">You</Text>
                            </View>
                        )}
                    </View>
                    <View className="flex-row flex-wrap gap-1.5">
                        {prettyRoles.map((role, index) => {
                            const colors = ROLE_STYLES[role.key] ?? ROLE_STYLES.member;
                            return (
                                <View
                                    key={`${role.key}-${index}`}
                                    className="rounded-full px-2.5 py-0.5"
                                    style={{backgroundColor: colors.bg}}
                                >
                                    <Text className="text-xs font-medium" style={{color: colors.text}}>
                                        {role.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {hasActions && (
                    <Pressable
                        className="ml-2 h-9 w-9 items-center justify-center rounded-full active:bg-gray-100"
                        onPress={() => setMenuOpen(true)}
                        hitSlop={8}
                        accessibilityLabel="More options"
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color={colors.ink.muted}/>
                    </Pressable>
                )}
            </View>

            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuOpen(false)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/40"
                    onPress={() => setMenuOpen(false)}
                >
                    <Pressable
                        className="rounded-t-3xl bg-white px-5 pb-8 pt-4"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="mb-3 items-center">
                            <View className="mb-3 h-1 w-10 rounded-full bg-gray-300"/>
                            <Text className="text-lg font-bold text-black">{username}</Text>
                            <Text className="text-sm text-gray-500">{text.actions}</Text>
                        </View>
                        <MemberActions
                            canKickUser={canKickUser && !isCurrentUser}
                            canPromoteToAdmin={canPromoteToAdmin}
                            canPromoteToManager={canPromoteToManager}
                            userRoles={userRoles}
                            onActionPress={handleActionPress}
                            onDone={() => setMenuOpen(false)}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
