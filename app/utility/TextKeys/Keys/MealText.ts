

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
    | 'preference'
    | 'isCook'
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
}