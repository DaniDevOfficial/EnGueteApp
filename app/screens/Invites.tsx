import React, {useEffect, useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {BackButton} from "../components/Ui/BackButton";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {PageTitleSection} from "../components/Ui/PageTitleSection";
import {GetAllInviteTokensOfAGroup, InviteToken} from "../repo/group/Invites";
import {useGroup} from "../context/groupContext";
import {RefreshControl} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import {CreateInvite} from "../components/group/CreateInvite";
import {InviteCard} from "../components/group/InviteCard";
import {CanPerformAction, PERMISSIONS} from "../utility/Roles";
import {PageSpinner} from "../components/Ui/PageSpinner";
import {showToast} from "../components/Ui/Toast";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {handleLogoutProcedure} from "../Util";
import {resetToUserScreen} from "../utility/navigation";

export function Invites() {
    const text = useTexts(['invites', 'createNewGroup', 'noActiveInviteTokens', 'error']);
    const navigation = useNavigation();
    const getError = useErrorText();
    const {group} = useGroup();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [inviteTokens, setInviteTokens] = useState<InviteToken[]>([]);

    const canVoid = CanPerformAction(group.userRoleRights, PERMISSIONS.CAN_VOID_INVITE_LINKS);

    async function loadInvites() {
        try {
            const response = await GetAllInviteTokensOfAGroup(group.groupId);
            setInviteTokens(response);
        } catch (e) {
            showToast({
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })

            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                navigation.goBack();
                return;
            }
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }

    async function onRefresh() {
        setRefreshing(true)
        await loadInvites()
        setRefreshing(false)
    }

    useEffect(() => {
        loadInvites()
    }, []);

    if (loading) {
        return <PageSpinner/>
    }

    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.invites}/>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16, paddingBottom: 100}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {inviteTokens.length > 0 ? (
                    <View className="mt-4 gap-3">
                        {inviteTokens.map((inviteToken) => (
                            <InviteCard
                                key={inviteToken.inviteToken}
                                inviteToken={inviteToken.inviteToken}
                                inviteLink={process.env.EXPO_PUBLIC_WEB_URL + '#/invite/' + inviteToken.inviteToken}
                                canVoid={canVoid}
                                expiryDate={inviteToken.expiresAt}
                                onVoid={onRefresh}
                            />
                        ))}
                    </View>
                ) : (
                    <View className="mt-16 items-center px-6">
                        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                            <Text className="text-2xl">🔗</Text>
                        </View>
                        <Text className="text-center text-base text-gray-500">
                            {text.noActiveInviteTokens}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View className="absolute bottom-4 left-4 right-4">
                <CreateInvite groupId={group.groupId} onSuccess={onRefresh}/>
            </View>
        </>
    )
}
