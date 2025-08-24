export type ErrorTextType =
    | 'error'
    | 'bothFieldsAreRequired'
    | 'errorPleaseEnterCorrectText'
    | 'errorNoOfflineLogout'
    | 'ifYouSeeThisPleaseReport'
    | 'unauthorizedError'
    | 'forbiddenError'
    | 'isOfflineError'
    | 'noConnectionToTheServerError'
    | 'youAreNotAllowedToPerformThisAction'
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
    | 'usernameOrEmailIsAlreadyTakenError'
    | 'wrongUsernameOrPasswordError'
    | 'mealDoesNotExistError'
    | 'filtersAreNotValidError'
    | 'unknownError'
    ;

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
    bothFieldsAreRequired: {
        german: 'Beide Felder sind erforderlich',
        english: 'Both fields are required',
    },
    errorPleaseEnterCorrectText: {
        german: 'Bitte gib den richtigen Text ein',
        english: 'Please enter the correct text',
    },
    errorNoOfflineLogout: {
        german: 'Offline-Logout ist nicht möglich',
        english: 'Offline logout is not possible',
    },
    ifYouSeeThisPleaseReport: {
        german: 'Wenn du dies siehst, melde es bitte',
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
    isOfflineError: {
        german: 'Diese Aktion ist offline nicht verfügbar',
        english: 'This action is not available offline',
    },
    noConnectionToTheServerError: {
        german: 'Keine Verbindung zum Server. Bitte überprüfe deine Internetverbindung oder versuche es später erneut.',
        english: 'No connection to the server. Please check your internet connection or try again later.',
    },
    youAreNotAllowedToPerformThisAction: {
        german: 'Du bist nicht berechtigt, diese Aktion auszuführen',
        english: 'You are not allowed to perform this action',
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
        german: 'Du darfst diese Gruppe nicht löschen',
        english: 'You are not allowed to delete this group',
    },
    notAllowedToUpdateGroupError: {
        german: 'Du darfst diese Gruppe nicht bearbeiten',
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
        german: 'Du kannst dich nicht selbst entfernen oder blockieren',
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
    usernameOrEmailIsAlreadyTakenError: {
        german: 'Benutzername oder Email sind bereits vergeben',
        english: 'Username or Email are already taken',
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
    },
    unknownError: {
        german: 'Unbekannter Fehler',
        english: 'Unknown error',
    },
}
