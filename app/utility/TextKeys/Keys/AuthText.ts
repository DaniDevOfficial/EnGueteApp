export type AuthTextType =
    | 'login'
    | 'signup'
    | 'welcomeBack'
    | 'welcomeBackInfoText'
    | 'pleaseSignIn'
    | 'newAccountGreetingsText'
    | 'createNewAccount'
    | 'createNewAccountSlogan'
    | 'createNewAccountInfoText'
    | 'createAccount'
    | 'allFieldsAreRequired'
    | 'username'
    | 'password'
    | 'email'
    | 'enterUsername'
    | 'enterPassword'
    | 'enterYourOldPassword'
    | 'enterYourNewPassword'
    | 'confirmYourNewPassword'
    | 'editPassword'
    | 'enterEmail'
    | 'createAnAccount'
    | 'orLogin'
    | 'welcomeBackUsername'
    | 'updateUsername'
    | 'editUsername'
    | 'account'
    | 'clearLocalData'
    | 'clearLocalDataQuestionText'
    | 'logoutQuestionText'
    | 'deleteAccount'
    | 'deleteAccountInfo'
    | 'privacyPolicy'
    | 'deleteAccountRequiredText'
    | 'thisActionCannotBeUndone'
    | 'pleaseEnterTextToConfirm'
    | 'forgotPassword'
    | 'pleaseEnterEmailForResetLink'
    | 'sendResetLink'
    | 'missingEmail'
    | 'checkYourInbox'
    | 'ifAnAccountExistsYouWillRecieveAResetEmail'
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
    'welcomeBackInfoText': {
        german: 'Melden dich an, um zu sehen, was heute auf dem Speiseplan steht, teil deine Vorlieben und setze dich mit uns an den Familientisch.',
        english: 'Log in to see what’s cooking today, share your cravings, and join the family table.',
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
    'createNewAccountSlogan': {
        german: 'Essenszeit, einfach gemacht',
        english: 'Meal Time, Made Simple',
    },
    'createNewAccountInfoText': {
        german: 'Erstelle einen Account und sorge für unterhaltsame, stressfreie Mahlzeiten im echten Familienstil.',
        english: 'Create an Account and keep meals fun, stress-free, and truly family-style',
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
    'enterYourOldPassword': {
        german: 'Altes Passwort eingeben',
        english: 'Enter your old password',
    },
    'enterYourNewPassword': {
        german: 'Neues Passwort eingeben',
        english: 'Enter your new password',
    },
    'confirmYourNewPassword': {
        german: 'Neues Passwort bestätigen',
        english: 'Confirm your new password',
    },
    'editPassword': {
        german: 'Passwort bearbeiten',
        english: 'Edit password',
    },
    'enterEmail': {
        german: 'E-Mail eingeben',
        english: 'Enter your email',
    },
    'createAnAccount': {
        german: 'Erstelle einen Account',
        english: 'Create an account',
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
    'account': {
        german: 'Account',
        english: 'Account',
    },
    'editUsername': {
        german: 'Nutzernamen bearieten',
        english: 'Edit username',
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
    'deleteAccountInfo': {
        german: 'Der Account wird als gelöscht markiert und nach 30 Tagen endgültig gelöscht. Wenn Sie sich innerhalb dieses Zeitraums erneut anmelden, wird die Löschmarkierung aufgehoben.',
        english: 'Your account will be marked for deletion and permanently removed after 30 days. If you log in again during this period, the deletion request will be canceled.',
    },
    'privacyPolicy': {
        german: 'Privacy Policy',
        english: 'Privacy Policy',
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
        german: 'Um die Aktion zu bestätigen, bitte den Text eingeben: [text]',
        english: 'To confirm the action, please enter the text: [text]',
    },
    'forgotPassword': {
        german: 'Passwort vergessen',
        english: 'Forgot password',
    },
    'pleaseEnterEmailForResetLink': {
        german: 'Bitte gib deine email ein und wir werden dir einen Passwort Reset link zusenden',
        english: 'Please enter your email and we will send you a reset link',
    },
    'sendResetLink': {
        german: 'Link schicken',
        english: 'Send reset link',
    },
    'missingEmail': {
        german: 'Email fehlt',
        english: 'Missing Email',
    },
    'checkYourInbox': {
        german: 'Inbox überprüfen',
        english: 'Check your inbox',
    },
    'ifAnAccountExistsYouWillRecieveAResetEmail': {
        german: 'Falls ein Account existiert erhälst du einen Reset Link',
        english: 'If an account exists, you’ll receive a reset link.',
    },
}