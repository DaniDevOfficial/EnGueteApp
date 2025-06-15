

// replace the User with the actual name of the TextKeyGroup.
export type UserTextType =
    | 'userSettings'
    | 'dataAndPrivacy'
    | 'dangerZone'
    ;

export type UserTextKeyType = {
    [K in UserTextType]: {
        german: string;
        english: string;
    };
};

export const UserTextKey: UserTextKeyType = {
    'userSettings': {
        german: 'Nutzer Einstellungen',
        english: 'User Settings',
    },
    'dataAndPrivacy': {
        german: 'Daten & Privatsphäre',
        english: 'Data & Privacy',
    },    'dangerZone': {
        german: 'Gefahrenzone',
        english: 'Danger Zone',
    },
}