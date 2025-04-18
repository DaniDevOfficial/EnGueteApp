

export type ErrorTextType =
    | 'error'
    | 'errorPleaseEnterCorrectText'
    | 'errorNoOfflineLogout'
    ;

export type ErrorTextKeyType = {
    [K in ErrorTextType]: {
        german: string;
        english: string;
    };
};

export const ErrorTextKey: ErrorTextKeyType = {
    'error': {
        german: 'Fehler',
        english: 'Error',
    },
    'errorPleaseEnterCorrectText': {
        german: 'Bitte geben Sie den richtigen Text ein',
        english: 'Please enter the correct text',
    },
    'errorNoOfflineLogout': {
        german: 'Offline-Logout ist nicht möglich',
        english: 'Offline logout is not possible',
    },
}