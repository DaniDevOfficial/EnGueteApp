function getText(textKey: string, replaceData?: Record<string, string>): string {
    return textKey;
}

const TextKeys = {
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
    'participant': {
        german: 'Teilnehmer',
        english: 'Participants',
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
}