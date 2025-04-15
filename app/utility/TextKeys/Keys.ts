export type TextKey =
    | 'noParticipants'
    | 'login'
    | 'signup'
    | 'welcomeBack'
    | 'pleaseSignIn'
    | 'newAccountGreetingsText'
    | 'createNewAccount'
    | 'createAccount'
    | 'username'
    | 'password'
    | 'email'
    | 'enterUsername'
    | 'enterPassword'
    | 'enterEmail'
    | 'orCreateAnAccount'
    | 'orLogin'
    | 'welcomeBackUsername'
    | 'youAreInNoGroup'
    | 'startByJoiningOrCreating'
    | 'yourGroups'
    | 'noQuantity'
    | 'oneParticipant'
    | 'participants'
    | 'noMealsInThisGroup'
    | 'createNewMeal'
    | 'undecided'
    | 'now'
    | 'in'
    | 'minute'
    | 'minutes'
    | 'todayAt'
    | 'agoTimeUnit'
    | 'yesterdayAt'
    | 'tomorrowAt'
    | 'last'
    | 'thisWeekdayAtTime'
    | 'onMonthDayAtTime'
    | 'at'
    | 'on'
    | 'mealName'
    | 'mealNamePlaceholder'
    | 'mealType'
    | 'mealTypePlaceholder'
    | 'scheduledAt'
    | 'scheduledAtPlaceholder'
    | 'mealDescription'
    | 'mealDescriptionPlaceholder'
    | 'placeholderIsRequired'
    | 'placeholderIsInvalid'
    | 'noNotes'
    | 'editPreferences'
    | 'preference'
    | 'isCook'
    | 'save'
    | 'cancel'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
    | 'morning'
    | 'day'
    | 'afternoon'
    | 'evening'
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'
    | 'language'
    | 'theme'
    ;

export interface TextKeysInterface {
    // @ts-ignore
    [key in TextKey]: {
        german: string;
        english: string;
    };
}


export const textKeys: TextKeysInterface = {
    'noParticipants': {
        german: 'Keine Teilnehmer 😞',
        english: 'No Participants 😞',
    },
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
    'youAreInNoGroup': {
        german: 'Es sieht so aus als ob du in keiner Gruppe bist 😞',
        english: 'It looks like you are in no group 😞',
    },
    'startByJoiningOrCreating': {
        german: 'Beginne damit, einer Gruppe beizutreten oder eine zu erstellen 🦾',
        english: 'Start by joining or creating a group 🦾',
    },
    'yourGroups': {
        german: 'Deine Gruppen',
        english: 'Your Groups',
    },
    'noQuantity': {
        german: 'Keine',
        english: 'No',
    },
    'oneParticipant': {
        german: 'Ein Teilnehmer',
        english: 'One Participant',
    },
    'participants': {
        german: 'Teilnehmer',
        english: 'Participants',
    },
    'noMealsInThisGroup': {
        german: 'Keine Mahlzeiten gefunden 😞',
        english: 'No meals found 😞',
    },
    'createNewMeal': {
        german: 'Neue Mahlzeit erstellen',
        english: 'Create new meal',
    },
    'undecided': {
        german: 'Unentschieden',
        english: 'Undecided',
    },
    'now': {
        german: 'Jetzt',
        english: 'Now',
    },
    'in': {
        german: 'In',
        english: 'In',
    },
    'minute': {
        german: 'Minute',
        english: 'minute',
    },
    'minutes': {
        german: 'Minuten',
        english: 'minutes',
    },
    'todayAt': {
        german: 'Heute um',
        english: 'Today at',
    },
    'agoTimeUnit': {
        german: 'Vor [time] [unit]',
        english: '[time] [unit] ago',
    },
    'yesterdayAt': {
        german: 'Gestern um',
        english: 'Yesterday at',
    },
    'tomorrowAt': {
        german: 'Morgen um',
        english: 'Tomorrow at',
    },
    'last': {
        german: 'Letzter',
        english: 'Last',
    },
    'thisWeekdayAtTime': {
        german: 'Dieser [weekday] um [time]',
        english: 'This [weekday] at [time]',
    },
    'onMonthDayAtTime': {
        german: 'Am  [day]. [month] um [time]',
        english: 'On [month] [day] at [time]',
    },
    'at': {
        german: 'Um',
        english: 'at',
    },
    'on': {
        german: 'Am',
        english: 'On',
    },
    'mealName': {
        german: 'Name der Mahlzeit',
        english: 'Meal name',
    },
    'mealNamePlaceholder': {
        german: 'Lasagne mit Salat',
        english: 'Lasagna with salad',
    },
    'mealType': {
        german: 'Mahlzeit Typ',
        english: 'Meal type',
    },
    'mealTypePlaceholder': {
        german: 'Abendessen',
        english: 'Dinner',
    },
    'scheduledAt': {
        german: 'Geplant für',
        english: 'Scheduled at',
    },
    'scheduledAtPlaceholder': {
        german: 'Wann wird die Mahlzeit stattfinden?',
        english: 'When will the meal take place?',
    },
    'mealDescription': {
        german: 'Mahlzeit Beschreibung',
        english: 'Meal description',
    },
    'mealDescriptionPlaceholder': {
        german: 'Rezept, Zutaten, etc.',
        english: 'The ingredients, the recipe, etc.',
    },
    'placeholderIsRequired': {
        german: '[what] ist erforderlich',
        english: '[what] is required',
    },
    'placeholderIsInvalid': {
        german: '[what] ist ungültig',
        english: '[what] is invalid',
    },
    'noNotes': {
        german: 'Keine Notizen',
        english: 'No notes',
    },
    'editPreferences': {
        german: 'Präferenze bearbeiten',
        english: 'Edit preference',
    },
    'preference': {
        german: 'Neue Präferenz',
        english: 'New preference',
    },
    'isCook': {
        german: 'Ist Koch ein Koch? 👨‍🍳',
        english: 'Is cook? 👨‍🍳 ',
    },
    'save': {
        german: 'Speichern',
        english: 'Save',
    },
    'cancel': {
        german: 'Abbrechen',
        english: 'Cancel',
    },
    'monday': {
        german: 'Montag',
        english: 'Monday',
    },
    'tuesday': {
        german: 'Dienstag',
        english: 'Tuesday',
    },
    'wednesday': {
        german: 'Mittwoch',
        english: 'Wednesday',
    },
    'thursday': {
        german: 'Donnerstag',
        english: 'Thursday',
    },
    'friday': {
        german: 'Freitag',
        english: 'Friday',
    },
    'saturday': {
        german: 'Samstag',
        english: 'Saturday',
    },
    'sunday': {
        german: 'Sonntag',
        english: 'Sunday',
    },
    'morning': {
        german: 'Morgen',
        english: 'Morning',
    },
    'day': {
        german: 'Tag',
        english: 'Day',
    },
    'afternoon': {
        german: 'Nachmittag',
        english: 'Afternoon',
    },
    'evening': {
        german: 'Abend',
        english: 'Evening',
    },
    'january': {
        german: 'Januar',
        english: 'January',
    },
    'february': {
        german: 'Februar',
        english: 'February',
    },
    'march': {
        german: 'März',
        english: 'March',
    },
    'april': {
        german: 'April',
        english: 'April',
    },
    'may': {
        german: 'Mai',
        english: 'May',
    },
    'june': {
        german: 'Juni',
        english: 'June',
    },
    'july': {
        german: 'Juli',
        english: 'July',
    },
    'august': {
        german: 'August',
        english: 'August',
    },
    'september': {
        german: 'September',
        english: 'September',
    },
    'october': {
        german: 'Oktober',
        english: 'October',
    },
    'november': {
        german: 'November',
        english: 'November',
    },
    'december': {
        german: 'Dezember',
        english: 'December',
    },
    'language': {
        german: 'Sprache',
        english: 'Language',
    },
    'theme': {
        german: 'Farbschema',
        english: 'Color Theme',
    },
}

