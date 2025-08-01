import React, {useEffect, useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {PageTitleSection} from "../components/UI/PageTitleSection";
import {GetAllInviteTokensOfAGroup, InviteToken} from "../repo/group/Invites";
import {useGroup} from "../context/groupContext";
import {Box, ScrollView, Text, useToast, VStack} from "native-base";
import {RefreshControl} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import {CreateInvite} from "../components/group/CreateInvite";
import {InviteCard} from "../components/group/InviteCard";
import {CanPerformAction, PERMISSIONS} from "../utility/Roles";
import {PageSpinner} from "../components/UI/PageSpinner";
import {showToast} from "../components/UI/Toast";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../utility/Errors";
import {handleLogoutProcedure} from "../Util";
import {resetToUserScreen} from "../utility/navigation";

export function Invites() {
    const text = useTexts(['invites', 'createNewGroup', 'noActiveInviteTokens', 'error']);
    const navigation = useNavigation();
    const toast = useToast();
    const getError = useErrorText();
    const {group} = useGroup();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [inviteTokens, setInviteTokens] = useState<InviteToken[]>([]);
    const [saving, setSaving] = useState<boolean>(true);
    const canVoid = CanPerformAction(group.userRoleRights, PERMISSIONS.CAN_VOID_INVITE_LINKS);

    async function loadInvites() {
        try {
            const response = await GetAllInviteTokensOfAGroup(group.groupId);
            setInviteTokens(response);
        } catch (e) {
            showToast({
                toast,
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
        return <PageSpinner />
    }

    return (
        <>
            <BackButton/>
            <PageTitleSection title={text.invites}/>
            <ScrollView
                w={'100%'}
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <VStack alignItems="center" w={'100%'}>
                    {inviteTokens.length > 0 ? (inviteTokens.map((inviteToken, key) => (
                            <InviteCard key={key} inviteToken={inviteToken.inviteToken} inviteLink={DEFAULT_APP_URL + inviteToken.inviteToken}
                                        canVoid={canVoid} expiryDate={inviteToken.expiresAt} onVoid={onRefresh}/>
                        ))
                    ) : (
                        <Box mt={5}>
                            <Text color={"gray.500"} textAlign={"center"}>
                                {text.noActiveInviteTokens}
                            </Text>
                        </Box>
                    )}
                </VStack>
            </ScrollView>
            <CreateInvite groupId={group.groupId} onSuccess={onRefresh}/>
        </>

    )
}