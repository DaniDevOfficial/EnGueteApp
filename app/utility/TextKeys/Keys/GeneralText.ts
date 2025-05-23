

export type GeneralTextType =

    | 'language'
    | 'theme'
    | 'logout'
    | 'save'
    | 'cancel'
    | 'okay'
    | 'close'
    | 'confirm'
    ;

export type GeneralTextKeyType = {
    [K in GeneralTextType]: {
        german: string;
        english: string;
    };
};

export const GeneralTextKey: GeneralTextKeyType = {

    'language': {
        german: 'Sprache',
        english: 'Language',
    },
    'theme': {
        german: 'Farbschema',
        english: 'Color Theme',
    },
    'logout': {
        german: 'Ausloggen',
        english: 'Logout',
    },
    'save': {
        german: 'Speichern',
        english: 'Save',
    },
    'cancel': {
        german: 'Abbrechen',
        english: 'Cancel',
    },
    'okay': {
        german: 'Okay',
        english: 'Okay',
    },
    'close': {
        german: 'Schliessen',
        english: 'Close',
    },
    'confirm': {
        german: 'Bestätigen',
        english: 'Confirm',
    },
}