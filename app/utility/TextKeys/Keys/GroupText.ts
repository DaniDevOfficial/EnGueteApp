

export type GroupTextType =
    | 'noParticipants'
    | 'youAreInNoGroup'
    | 'startByJoiningOrCreating'
    | 'yourGroups'
    | 'noQuantity'
    | 'oneParticipant'
    | 'participants'
    | 'noMealsInThisGroup'
    | 'createNewMeal'
    | 'createNewGroup'
    | 'groupName'

    ;

export type GroupTextKeyType = {
    [K in GroupTextType]: {
        german: string;
        english: string;
    };
};

export const GroupTextKey: GroupTextKeyType = {
    'noParticipants': {
        german: 'Keine Teilnehmer 😞',
        english: 'No Participants 😞',
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
    'createNewGroup': {
        german: 'Neue Gruppe erstellen',
        english: 'Create new group',
    },
    'groupName': {
        german: 'Gruppenname',
        english: 'Group name',
    },

}