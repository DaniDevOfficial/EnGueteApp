

export type MealTextType =
    | 'undecided'
    | 'mealName'
    | 'mealNamePlaceholder'
    | 'mealType'
    | 'mealTypePlaceholder'
    | 'scheduledAt'
    | 'scheduledAtPlaceholder'
    | 'mealDescription'
    | 'mealDescriptionPlaceholder'
    | 'noNotes'
    | 'editPreferences'
    | 'newPreference'
    | 'preference'
    | 'isCook'
    | 'open'
    | 'closed'
    | 'finished'
    ;

export type MealTextKeyType = {
    [K in MealTextType]: {
        german: string;
        english: string;
    };
};

export const MealTextKey: MealTextKeyType = {
    'undecided': {
        german: 'Unentschieden',
        english: 'Undecided',
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
        german: 'Mittag, Abendessen...',
        english: 'Lunch, Dinner...',
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
    'noNotes': {
        german: 'Keine Notizen',
        english: 'No notes',
    },
    'editPreferences': {
        german: 'Präferenze bearbeiten',
        english: 'Edit preference',
    },
    'newPreference': {
        german: 'Neue Präferenz',
        english: 'New preference',
    },
    'preference': {
        german: 'Präferenz',
        english: 'Preference'
    },
    'open': {
        german: 'Offen',
        english: 'Open'
    },
    'closed': {
        german: 'Geschlossen',
        english: 'Closed'
    },
    'finished': {
        german: 'Beendet',
        english: 'Finished'
    },
    'isCook': {
        german: 'Ist ein Koch? 👨‍🍳',
        english: 'Is cook? 👨‍🍳 ',
    },
}