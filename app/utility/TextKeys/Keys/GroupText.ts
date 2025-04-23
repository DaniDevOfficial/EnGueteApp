

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
    | 'groupSettings'
    | 'leaveGroup'
    | 'leaveGroupInfoText'
    | 'invites'
    | 'updateGroupName'
    | 'noActiveInviteTokens'
    | 'createInvite'
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
    'groupSettings': {
        german: 'Gruppeneinstellungen',
        english: 'Group settings',
    },
    'leaveGroup': {
        german: 'Gruppe verlassen',
        english: 'Leave group',
    },
    'leaveGroupInfoText': {
        german: 'Wenn du die Gruppe verlässt, kannst du nicht mehr auf die Gruppenfunktionen zugreifen. Möchtest du wirklich die Gruppe [groupName] verlassen?',
        english: 'If you leave the group, you will no longer be able to access the group features. Do you really want to leave the group [groupName]?',
    },
    'invites': {
        german: 'Einladungen',
        english: 'Invites',
    },
    'updateGroupName': {
        german: 'Gruppenname aktualisieren',
        english: 'Update group name',
    },
    'noActiveInviteTokens': {
        german: 'Keine aktiven Einladungen gefunden 😞',
        english: 'No active invites found 😞',
    },
    'createInvite': {
        german: 'Einladung erstellen',
        english: 'Create invite',
    }
}

type tmp = string