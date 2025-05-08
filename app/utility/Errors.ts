export class UnauthorizedError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class BadRequestError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class InternalServerError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class DoNothingError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class ForbiddenError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'ForbiddenError';
    }
}

export class TimeoutError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'TimeoutError';
    }
}

export const FRONTEND_ERRORS = {
    // Generic Errors
    UNAUTHORIZED_ERROR: "unauthorizedError",
    FORBIDDEN_ERROR: "forbiddenError",
    NOT_FOUND_ERROR: "notFoundError",
    INTERNAL_SERVER_ERROR: "internalServerError",
    BAD_REQUEST_ERROR: "badRequestError",

    NOT_ALLOWED_TO_DELETE_GROUP_ERROR: "notAllowedToDeleteGroupError",
    NOT_ALLOWED_TO_UPDATE_GROUP_ERROR: "notAllowedToUpdateGroupError",
    GROUP_DOES_NOT_EXIST_ERROR: "groupDoesNotExistError",

    INVALID_INVITE_TOKEN_ERROR: "invalidInviteTokenError",

    USER_DOES_NOT_EXIST_ERROR: "userDoesNotExistError",
    CREATE_GROUP_ERROR: "createGroupError",

    YOU_CANT_KICK_OR_BAN_YOURSELF_ERROR: "youCantKickOrBanYourselfError",
    INVALID_ROLE_ERROR: "invalidRoleError",

    PASSWORD_FORMAT_TOO_SHORT_ERROR: "passwordFormatTooShortError",
    PASSWORD_FORMAT_NEEDS_UPPER_LOWER_SPECIAL_ERROR: "passwordFormatNeedsUpperLowerSpecialError",
    PASSWORD_FORMAT_TOO_LONG_ERROR: "passwordFormatTooLongError",
    PASSWORD_DOES_NOT_MATCH_ERROR: "passwordDoesNotMatchError",

    USERNAME_IS_ALREADY_TAKEN_ERROR: "usernameIsAlreadyTakenError",
    WRONG_USERNAME_OR_PASSWORD_ERROR: "wrongUsernameOrPasswordError",

    MEAL_DOES_NOT_EXIST_ERROR: "mealDoesNotExistError",

    FILTERS_ARE_NOT_VALID_ERROR: "filtersAreNotValidError"
}
