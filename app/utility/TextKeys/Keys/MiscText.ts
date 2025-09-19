

export type MiscTextType =
    | 'at'
    | 'on'
    | 'isRequired'
    | 'placeholderIsRequired'
    | 'placeholderIsInvalid'
    | 'actions'
    | 'submit'
    | 'expiresAt'
    | 'showQr'
    | 'qrCode'
    | 'copyLink'
    | 'copiedLink'
    | 'currentWeek'
    | 'lastWeek'
    | 'nextWeek'
    | 'showInformation'
    ;

export type MiscTextKeyType = {
    [K in MiscTextType]: {
        german: string;
        english: string;
    };
};

export const MiscTextKey: MiscTextKeyType = {
    'at': {
        german: 'Um',
        english: 'at',
    },
    'on': {
        german: 'Am',
        english: 'On',
    },
    'placeholderIsRequired': {
        german: '[what] ist erforderlich',
        english: '[what] is required',
    },
    'isRequired': {
        german: 'ist erforderlich',
        english: 'is required',
    },
    'placeholderIsInvalid': {
        german: '[what] ist ungültig',
        english: '[what] is invalid',
    },
    'actions': {
        german: 'Aktionen',
        english: 'Actions',
    },
    'submit': {
        german: 'Bestätigen',
        english: 'Submit',
    },
    'expiresAt': {
        german: 'Ablaufdatum',
        english: 'Expires at',
    },
    'showQr': {
        german: 'QR-Code anzeigen',
        english: 'Show QR code',
    },
    'copyLink': {
        german: 'Link kopieren',
        english: 'Copy link',
    },
    'copiedLink': {
        german: 'Link kopiert',
        english: 'Link copied',
    },
    'qrCode': {
        german: 'QR-Code',
        english: 'QR code',
    },
    'currentWeek': {
        german: 'Diese Woche',
        english: 'Current week',
    },
    'lastWeek': {
        german: 'Letzte Woche',
        english: 'Last week',
    },
    'nextWeek': {
        german: 'Nächste Woche',
        english: 'Next week',
    },
    'showInformation': {
        german: 'Informationen anzeigen',
        english: 'Show Information',
    },
}
