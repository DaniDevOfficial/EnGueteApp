export const PERMISSIONS = {
    CAN_UPDATE_MEAL: "can_update_meal",
    CAN_DELETE_MEAL: "can_delete_meal",
    CAN_CREATE_MEAL: "can_create_meal",
    CAN_CHANGE_MEAL_FLAGS: "can_change_meal_flags",

    CAN_CHANGE_FORCE_MEAL_PREFERENCE_AND_COOKING: "can_force_meal_preference_and_cooking",

    CAN_UPDATE_GROUP: "can_update_group",
    CAN_DELETE_GROUP: "can_delete_group",

    CAN_BAN_USERS: "can_ban_users",
    CAN_UNBAN_USER: "can_unban_user",
    CAN_KICK_USERS: "can_kick_users",

    CAN_CREATE_INVITE_LINKS: "can_create_invite_links",
    CAN_VOID_INVITE_LINKS: "can_void_invite_links",
    CAN_VIEW_INVITE_LINKS: "can_view_invite_links",

    CAN_FORCE_OPT_IN: "can_force_opt_in",
    CAN_SEND_NOTIFICATIONS: "can_send_notifications",

    CAN_PROMOTE_TO_ADMINS: "can_promote_to_admin",
    CAN_DEMOTE_FROM_ADMINS: "can_demote_from_admin",
    CAN_PROMOTE_TO_MANAGER: "can_promote_to_manager",
    CAN_DEMOTE_FROM_MANAGER: "can_demote_from_manager",
};
export const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    MEMBER: "member",
};

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
type Role = (typeof ROLES)[keyof typeof ROLES];
export const ROLE_PERMISSIONS: Record<Permission, Partial<Record<Role, boolean>>> = {
    [PERMISSIONS.CAN_UPDATE_MEAL]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_DELETE_MEAL]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_CREATE_MEAL]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_CHANGE_MEAL_FLAGS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_CHANGE_FORCE_MEAL_PREFERENCE_AND_COOKING]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_UPDATE_GROUP]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_DELETE_GROUP]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_BAN_USERS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_KICK_USERS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_UNBAN_USER]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_CREATE_INVITE_LINKS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_VOID_INVITE_LINKS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_VIEW_INVITE_LINKS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_FORCE_OPT_IN]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_SEND_NOTIFICATIONS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: true,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_PROMOTE_TO_ADMINS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_DEMOTE_FROM_ADMINS]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_PROMOTE_TO_MANAGER]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
    [PERMISSIONS.CAN_DEMOTE_FROM_MANAGER]: {
        [ROLES.ADMIN]: true,
        [ROLES.MANAGER]: false,
        [ROLES.MEMBER]: false,
    },
};

export function GetUserRoleRights(
    userRoles: string[],
): string[] {

    if (!userRoles || userRoles.length === 0) {
        return [];
    }

    const userRoleRights: string[] = [];
        for (const [permission] of Object.entries(ROLE_PERMISSIONS)) {
            if (rolesCanPerformAction(userRoles, permission)) {
                userRoleRights.push(permission);
            }
    }
    return userRoleRights;
}



function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[permission]?.[role] ?? false;
}

function rolesCanPerformAction(
    userRole: Role[],
    action: Permission,
): boolean {

    for (const role of userRole) {
        if (hasPermission(role, action)) {
            return true;
        }
    }
    return false;
}

export function CanPerformAction(
    userRoleRights: string[],
    action: string,
): boolean {
    return userRoleRights.includes(action);
}