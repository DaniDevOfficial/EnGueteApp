

export type ErrorTextType =
    | 'error'
    | 'errorPleaseEnterCorrectText'
    | 'errorNoOfflineLogout'
    | 'ifYouSeeThisPleaseReport'
    | 'unauthorizedError'
    | 'forbiddenError'
    | 'notFoundError'
    | 'internalServerError'
    | 'badRequestError'
    | 'notAllowedToDeleteGroupError'
    | 'notAllowedToUpdateGroupError'
    | 'groupDoesNotExistError'
    | 'invalidInviteTokenError'
    | 'userDoesNotExistError'
    | 'createGroupError'
    | 'youCantKickOrBanYourselfError'
    | 'invalidRoleError'
    | 'passwordFormatTooShortError'
    | 'passwordFormatNeedsUpperLowerSpecialError'
    | 'passwordFormatTooLongError'
    | 'passwordDoesNotMatchError'
    | 'usernameIsAlreadyTakenError'
    | 'wrongUsernameOrPasswordError'
    | 'mealDoesNotExistError'
    | 'filtersAreNotValidError';

export type ErrorTextKeyType = {
    [K in ErrorTextType]: {
        german: string;
        english: string;
    };
};

export const ErrorTextKey: ErrorTextKeyType = {
    error: {
        german: 'Fehler',
        english: 'Error',
    },
    errorPleaseEnterCorrectText: {
        german: 'Bitte geben Sie den richtigen Text ein',
        english: 'Please enter the correct text',
    },
    errorNoOfflineLogout: {
        german: 'Offline-Logout ist nicht möglich',
        english: 'Offline logout is not possible',
    },
    ifYouSeeThisPleaseReport: {
        german: 'Wenn Sie dies sehen, melden Sie es bitte',
        english: 'If you see this, please report it',
    },
    unauthorizedError: {
        german: 'Nicht autorisiert. Bitte einloggen.',
        english: 'Unauthorized. Please log in.',
    },
    forbiddenError: {
        german: 'Zugriff verweigert',
        english: 'Access denied',
    },
    notFoundError: {
        german: 'Nicht gefunden',
        english: 'Not found',
    },
    internalServerError: {
        german: 'Interner Serverfehler',
        english: 'Internal server error',
    },
    badRequestError: {
        german: 'Ungültige Anfrage',
        english: 'Invalid request',
    },
    notAllowedToDeleteGroupError: {
        german: 'Sie dürfen diese Gruppe nicht löschen',
        english: 'You are not allowed to delete this group',
    },
    notAllowedToUpdateGroupError: {
        german: 'Sie dürfen diese Gruppe nicht bearbeiten',
        english: 'You are not allowed to update this group',
    },
    groupDoesNotExistError: {
        german: 'Gruppe existiert nicht',
        english: 'Group does not exist',
    },
    invalidInviteTokenError: {
        german: 'Ungültiger Einladungslink',
        english: 'Invalid invite token',
    },
    userDoesNotExistError: {
        german: 'Benutzer existiert nicht',
        english: 'User does not exist',
    },
    createGroupError: {
        german: 'Gruppe konnte nicht erstellt werden',
        english: 'Failed to create group',
    },
    youCantKickOrBanYourselfError: {
        german: 'Sie können sich nicht selbst entfernen oder blockieren',
        english: "You can't kick or ban yourself",
    },
    invalidRoleError: {
        german: 'Ungültige Rolle',
        english: 'Invalid role',
    },
    passwordFormatTooShortError: {
        german: 'Passwort ist zu kurz',
        english: 'Password is too short',
    },
    passwordFormatNeedsUpperLowerSpecialError: {
        german: 'Passwort muss Gross-, Kleinbuchstaben und Sonderzeichen enthalten',
        english: 'Password must include uppercase, lowercase, and special characters',
    },
    passwordFormatTooLongError: {
        german: 'Passwort ist zu lang',
        english: 'Password is too long',
    },
    passwordDoesNotMatchError: {
        german: 'Passwörter stimmen nicht überein',
        english: 'Passwords do not match',
    },
    usernameIsAlreadyTakenError: {
        german: 'Benutzername ist bereits vergeben',
        english: 'Username is already taken',
    },
    wrongUsernameOrPasswordError: {
        german: 'Falscher Benutzername oder Passwort',
        english: 'Incorrect username or password',
    },
    mealDoesNotExistError: {
        german: 'Mahlzeit existiert nicht',
        english: 'Meal does not exist',
    },
    filtersAreNotValidError: {
        german: 'Filter sind ungültig',
        english: 'Filters are not valid',
    }
}
