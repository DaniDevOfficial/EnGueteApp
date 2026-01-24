

export type GeneralTextType =

    | 'language'
    | 'theme'
    | 'logout'
    | 'save'
    | 'cancel'
    | 'okay'
    | 'close'
    | 'confirm'
    | 'info'
    | 'back'
    | 'somethingWentWrong'
    | 'pleaseTryAgain'
    | 'areYouSureYouWantToPerfomThisAction'
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
    'info': {
        german: 'Information',
        english: 'Information',
    },
    'back': {
        german: 'Zurück',
        english: 'Back',
    },
    'somethingWentWrong': {
        german: 'Etwas ist schief gelaufen',
        english: 'Something went wrong',
    },
    'pleaseTryAgain': {
        german: 'Bitte versuche es erneut',
        english: 'Please try again',
    },
    'areYouSureYouWantToPerfomThisAction': {
        german: 'Bist du sicher, dass du diese Aktion ausführen möchtest?',
        english: 'Are you sure you want to perform this action?',
    },
}