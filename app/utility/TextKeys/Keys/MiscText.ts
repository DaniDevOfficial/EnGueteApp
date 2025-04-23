

export type MiscTextType =
    | 'at'
    | 'on'
    | 'placeholderIsRequired'
    | 'placeholderIsInvalid'
    | 'actions'
    | 'submit'
    | 'expiresAt'
    | 'showQr'
    | 'qrCode'
    | 'copyLink'
    | 'copiedLink'
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
}
