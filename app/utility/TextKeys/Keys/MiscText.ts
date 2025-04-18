

export type MiscTextType =
    | 'at'
    | 'on'
    | 'placeholderIsRequired'
    | 'placeholderIsInvalid'

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
}