

// replace the User with the actual name of the TextKeyGroup.
export type UserTextType =
    | 'userSettings'
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
    'dangerZone': {
        german: 'Gefahrenzone',
        english: 'Danger Zone',
    },
}