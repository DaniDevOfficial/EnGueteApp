import {useText, useTexts} from "../../../utility/TextKeys/TextKeys";
import {useNavigation} from "@react-navigation/native";
import {Option, SettingsSectionStack} from "../../UI/SettingSectionStack";
import {PERMISSIONS} from "../../../utility/Roles";
import {useGroup} from "../../../context/groupContext";
import React, {useState} from "react";
import {ConfirmModal} from "../ConfirmModal";
import {DeleteGroupRequest, LeaveGroupRequest} from "../../../repo/Group";
import {resetToUserScreen} from "../../../utility/navigation";
import {showToast} from "../../UI/Toast";
import {useToast} from "native-base";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../../utility/Errors";
import {handleLogoutProcedure} from "../../../Util";

export function GroupActions() {
    const {group} = useGroup();
    const navigation = useNavigation();
    const toast = useToast();
    const getError = useErrorText();

    const text = useTexts(['groupActions', 'leaveGroup', 'deleteGroup', 'error']);
    const [leaveGroupModalOpen, setLeaveGroupModalOpen] = useState(false);
    const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);

    const leaveInfoText = useText('leaveGroupInfoText', {'groupName': group.groupName});
    const deleteConfirmText = useText('deleteGroupRequiredText', {'groupName': group.groupName});

    const options: Option[] = [
        {
            label: text.leaveGroup,
            onPress: () => {
                setLeaveGroupModalOpen(true);
            },
            icon: 'exit-to-app',
            iconColor: 'yellow.500',
        },
    ];

    if (group.userRoleRights && group.userRoleRights.includes(PERMISSIONS.CAN_DELETE_GROUP)) {
        options.push({
            label: text.deleteGroup,
            onPress: () => {
                setDeleteGroupModalOpen(true);
            },
            icon: 'delete-forever',
            iconColor: 'red.500',
            textColor: 'red.500',
        });
    }

    async function handleLeave() {
        try {
            await LeaveGroupRequest(group.groupId);
            resetToUserScreen(navigation);
        } catch (e) {
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: 'error',
            });
        }
    }
    async function handleDelete() {


        try {
            await DeleteGroupRequest(group.groupId);
            resetToUserScreen(navigation);
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
        }
    }


    return (
        <>
            <SettingsSectionStack title={text.groupActions} options={options}/>

            <ConfirmModal
                title={text.leaveGroup}
                isOpen={leaveGroupModalOpen}
                onClose={() => setLeaveGroupModalOpen(false)}
                onSuccess={handleLeave}
                text={leaveInfoText}
            />

            <ConfirmModal
                title={text.deleteGroup}
                isOpen={deleteGroupModalOpen}
                onClose={() => setDeleteGroupModalOpen(false)}
                onSuccess={handleDelete}
                requiredText={deleteConfirmText}
            />

        </>
    );
}