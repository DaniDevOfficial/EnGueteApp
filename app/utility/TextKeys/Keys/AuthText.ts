

export type AuthTextType =
    | 'login'
    | 'signup'
    | 'welcomeBack'
    | 'pleaseSignIn'
    | 'newAccountGreetingsText'
    | 'createNewAccount'
    | 'createAccount'
    | 'allFieldsAreRequired'
    | 'username'
    | 'password'
    | 'email'
    | 'enterUsername'
    | 'enterPassword'
    | 'enterEmail'
    | 'orCreateAnAccount'
    | 'orLogin'
    | 'welcomeBackUsername'
    | 'updateUsername'
    | 'clearLocalData'
    | 'clearLocalDataQuestionText'
    | 'logoutQuestionText'
    | 'deleteAccount'
    | 'deleteAccountRequiredText'
    | 'thisActionCannotBeUndone'
    | 'pleaseEnterTextToConfirm'
    ;

export type AuthTextKeyType = {
    [K in AuthTextType]: {
        german: string;
        english: string;
    };
};

export const AuthTextKey: AuthTextKeyType = {
    'login': {
        german: 'Einloggen',
        english: 'Login',
    },
    'signup': {
        german: 'Registrieren',
        english: 'Sign Up',
    },
    'welcomeBack': {
        german: 'Willkommen zurück',
        english: 'Welcome back',
    },
    'pleaseSignIn': {
        german: 'Bitte Einloggen',
        english: 'Please sign in',
    },
    'newAccountGreetingsText': {
        german: 'Schön, ein neues Gesicht zu sehen 😊',
        english: 'Glad to see a new Face 😊',
    },
    'createNewAccount': {
        german: 'Ein neues Konto erstellen',
        english: 'Create a new account',
    },
    'createAccount': {
        german: 'Konto erstellen',
        english: 'Create account',
    },
    'allFieldsAreRequired': {
        german: 'Alle Felder sind notwendig',
        english: 'All fields are required',
    },
    'username': {
        german: 'Benutzername',
        english: 'Username',
    },
    'password': {
        german: 'Passwort',
        english: 'Password',
    },
    'email': {
        german: 'E-Mail',
        english: 'Email',
    },
    'enterUsername': {
        german: 'Benutzername eingeben',
        english: 'Enter your username',
    },
    'enterPassword': {
        german: 'Passwort eingeben',
        english: 'Enter your password',
    },
    'enterEmail': {
        german: 'E-Mail eingeben',
        english: 'Enter your email',
    },
    'orCreateAnAccount': {
        german: 'Oder ein Konto erstellen',
        english: 'Or create an account',
    },
    'orLogin': {
        german: 'Oder einloggen',
        english: 'Or login',
    },
    'welcomeBackUsername': {
        german: 'Guten [timeOfDay], [username] 👋!',
        english: 'Good [timeOfDay], [username] 👋!',
    },
    'updateUsername': {
        german: 'Nutzernamen aktualisieren',
        english: 'Update username',
    },
    'clearLocalData': {
        german: 'Lokalen Daten löschen',
        english: 'Delete local data',
    },
    'clearLocalDataQuestionText': {
        german: 'Willst du wirklich alle lokalen Daten löschen? Dies wird alle gespeicherten Daten auf diesem Gerät entfernen.',
        english: 'Do you really want to delete all local data? This will remove all saved data on this device.',
    },
    'logoutQuestionText': {
        german: 'Möchtest du dich wirklich ausloggen?',
        english: 'Do you really want to logout?',
    },
    'deleteAccount': {
        german: 'Account löschen',
        english: 'Delete account',
    },
    'deleteAccountRequiredText': {
        german: '[username] Löschen',
        english: 'Delete [username]',
    },
    'thisActionCannotBeUndone': {
        german: 'Diese Aktion kann nicht rückgängig gemacht werden',
        english: 'This action cannot be undone',
    },
    'pleaseEnterTextToConfirm': {
        german: 'Bitte geben Sie den Text ein, um zu bestätigen: [text]',
        english: 'Please enter the text to confirm: [text]',
    },
}