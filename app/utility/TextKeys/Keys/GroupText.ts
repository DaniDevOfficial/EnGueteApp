

export type GroupTextType =
    | 'noParticipants'
    | 'youAreInNoGroup'
    | 'startByJoiningOrCreating'
    | 'groups'
    | 'yourGroups'
    | 'noQuantity'
    | 'oneParticipant'
    | 'participants'
    | 'noMealsInThisGroup'
    | 'noMealsInThisWeek'
    | 'createNewMeal'
    | 'createNewGroup'
    | 'searchForGroup'
    | 'groupName'
    | 'enterANameForTheGroup'
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
    | 'members'
    | 'manager'
    | 'admin'
    | 'groupSettings'
    | 'leaveGroup'
    | 'leaveGroupInfoText'
    | 'invites'
    | 'updateGroupName'
    | 'noActiveInviteTokens'
    | 'createInvite'
    | 'voidToken'
    | 'groupInvite'
    | 'youWereInvited'
    | 'joinGroup'
    | 'maybeLater'
    | 'noGroupsFound'
    | 'groupInformation'
    | 'editGroupInformation'
    | 'membersAndInvites'
    | 'groupActions'
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
    'groups': {
        german: 'Gruppen',
        english: 'Groups',
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
    'noMealsInThisWeek': {
        german: 'Keine Mahlzeiten für diese Woche gefunden 😞',
        english: 'No meals found for this Week 😞',
    },
    'createNewMeal': {
        german: 'Neue Mahlzeit erstellen',
        english: 'Create new meal',
    },
    'createNewGroup': {
        german: 'Neue Gruppe erstellen',
        english: 'Create new group',
    },
    'searchForGroup': {
        german: 'Nach Gruppe suchen',
        english: 'Search for group',
    },
    'groupName': {
        german: 'Gruppenname',
        english: 'Group name',
    },
    'enterANameForTheGroup': {
        german: 'Einen Namen für die Gruppe eingeben',
        english: 'Enter a name for the group',
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
    'members': {
        german: 'Mitglieder',
        english: 'Members',
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
    },
    'voidToken': {
        german: 'Einladung ungültig machen',
        english: 'Void token',
    },
    'groupInvite': {
        german: 'Gruppen Einladung',
        english: 'Group Invite',
    },
    'youWereInvited': {
        german: 'Du wurdest in eine Gruppe eingeladen eingeladen 🎉',
        english: 'You were invited to a group 🎉',
    },
    'joinGroup': {
        german: 'Gruppe beitreten',
        english: 'Join group',
    },
    'maybeLater': {
        german: 'Vielleicht später',
        english: 'Maybe later',
    },
    'noGroupsFound': {
        german: 'Keine Gruppen gefunden 😞',
        english: 'No groups found 😞',
    },
    'groupInformation': {
        german: 'Gruppeninformation',
        english: 'Group Information',
    },
    'editGroupInformation': {
        german: 'Gruppeninformation bearbeiten',
        english: 'Edit group information',
    },
    'membersAndInvites': {
        german: 'Mitglieder & Einladungen',
        english: 'Members & Invites',
    },
    'groupActions': {
        german: 'Gruppenaktionen',
        english: 'Group Actions',
    },
}

type tmp = string