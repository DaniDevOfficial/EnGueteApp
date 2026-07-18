import React, {useState} from "react";
import {Modal, Pressable, Text, TextInput, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {getFancyTimeDisplay} from "../../utility/Dates";
import * as Clipboard from 'expo-clipboard';
import {showToast} from "../Ui/Toast";
import {DeleteInviteToken} from "../../repo/group/Invites";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {handleLogoutProcedure} from "../../Util";
import {resetToUserScreen} from "../../utility/navigation";
import {useNavigation} from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import {colors} from '../../theme/colors';

interface InviteCardProps {
    inviteToken: string;
    inviteLink: string;
    expiryDate: string;
    canVoid: boolean;
    onVoid: () => Promise<void>;
}

export function InviteCard({inviteToken, expiryDate, inviteLink, canVoid, onVoid}: InviteCardProps) {
    const text = useTexts(['voidToken', 'actions', 'expiresAt', 'copyLink', 'copiedLink', 'showInformation', 'qrCode', 'close', 'invitation', 'shareInvitationLink']);
    const navigation = useNavigation();
    const getError = useErrorText();

    const [showInformation, setShowInformation] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const actions = [
        {
            title: text.showInformation,
            action: () => {
                setMenuOpen(false);
                setShowInformation(true);
            },
            destructive: false,
        },
    ];

    if (canVoid) {
        actions.push({
            title: text.voidToken,
            action: async () => {
                setMenuOpen(false);
                await voidToken();
            },
            destructive: true,
        })
    }

    async function voidToken() {
        try {
            await DeleteInviteToken(inviteToken);
            await onVoid();
            showToast({
                title: text.voidToken,
                description: text.voidToken,
                status: "success",
            })
        } catch (e) {
            showToast({
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
            }
        }
    }

    async function copyLink() {
        await Clipboard.setStringAsync(inviteLink);
        showToast({
            title: text.copiedLink,
            description: text.copiedLink,
            status: "success",
        })
    }

    return (
        <>
            <View className="w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-orange-50">
                    <Ionicons name="link" size={20} color={colors.brand.orangeLight}/>
                </View>

                <View className="flex-1 pr-2">
                    <Text className="mb-0.5 text-sm font-semibold text-black" numberOfLines={1}>
                        {inviteToken}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="time-outline" size={14} color={colors.ink.muted}/>
                        <Text className="text-xs text-gray-500" numberOfLines={1}>
                            {text.expiresAt}: {getFancyTimeDisplay(expiryDate)}
                        </Text>
                    </View>
                </View>

                <Pressable
                    className="h-9 w-9 items-center justify-center rounded-full active:bg-gray-100"
                    onPress={() => setMenuOpen(true)}
                    hitSlop={8}
                    accessibilityLabel="More options"
                >
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.ink.soft}/>
                </Pressable>
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
                            <Text className="text-lg font-bold text-black">{text.actions}</Text>
                        </View>
                        {actions.map((action, index) => (
                            <Pressable
                                key={index}
                                className="rounded-lg px-3 py-3 active:bg-gray-100"
                                onPress={action.action}
                            >
                                <Text className={`text-base ${action.destructive ? 'font-medium text-red-500' : 'text-gray-800'}`}>
                                    {action.title}
                                </Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={showInformation}
                transparent
                animationType="fade"
                onRequestClose={() => setShowInformation(false)}
            >
                <Pressable
                    className="flex-1 items-center justify-center bg-black/40 px-6"
                    onPress={() => setShowInformation(false)}
                >
                    <Pressable
                        className="w-full max-w-md rounded-xl bg-white p-5"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Pressable
                            className="absolute right-4 top-4 z-10"
                            onPress={() => setShowInformation(false)}
                            hitSlop={8}
                        >
                            <Ionicons name="close" size={28} color={colors.ink.faint}/>
                        </Pressable>

                        <View className="w-full items-center gap-3 pt-2">
                            <Text className="text-xl font-bold text-black">
                                {text.invitation}
                            </Text>
                            <Text className="text-center text-base font-light text-black">
                                {text.shareInvitationLink}
                            </Text>

                            <View className="my-2 items-center justify-center rounded-xl bg-white p-3">
                                <QRCode value={inviteLink} size={120}/>
                            </View>

                            <TextInput
                                value={inviteLink}
                                editable={false}
                                className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm text-black"
                            />

                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 active:opacity-60"
                                onPress={copyLink}
                            >
                                <Text className="text-base font-medium text-white">
                                    {text.copyLink}
                                </Text>
                            </Pressable>

                            <Text className="text-center text-sm text-gray-500" numberOfLines={1}>
                                {getFancyTimeDisplay(expiryDate)}
                            </Text>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
