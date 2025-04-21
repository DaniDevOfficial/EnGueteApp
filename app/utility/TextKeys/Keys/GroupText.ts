

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
    | 'deleteGroup'
    | 'deleteGroupRequiredText'
    | 'memberList'
    | 'noMembers'
    | 'promoteAdmin'
    | 'promoteToManager'
    | 'demoteAdmin'
    | 'demoteManager'
    | 'kickFromGroup'
    | 'member'
    | 'manager'
    | 'admin'
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
    'deleteGroup': {
        german: 'Gruppe löschen',
        english: 'Delete group',
    },
    'deleteGroupRequiredText': {
        german: '[groupName] löschen',
        english: 'Delete [groupName]',
    },
    'memberList': {
        german: 'Mitgliederliste',
        english: 'Member list',
    },
    'noMembers': {
        german: 'Keine Mitglieder gefunden 😞',
        english: 'No members found 😞',
    },
    'promoteAdmin': {
        german: 'Zum Admin befördern',
        english: 'Promote to Admin',
    },
    'promoteToManager': {
        german: 'Zum Manager befördern',
        english: 'Promote to Manager',
    },
    'demoteAdmin': {
        german: 'Vom Admin zurückstufen',
        english: 'Demote from Admin',
    },
    'demoteManager': {
        german: 'Vom Manager zurückstufen',
        english: 'Demote from Manager',
    },
    'kickFromGroup': {
        german: 'Aus der Gruppe werfen',
        english: 'Kick from the group',
    },
    'member': {
        german: 'Mitglied',
        english: 'Member',
    },
    'manager': {
        german: 'Manager',
        english: 'Manager',
    },
    'admin': {
        german: 'Admin',
        english: 'Admin',
    },

}

type tmp = string