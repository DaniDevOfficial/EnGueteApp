export function getParticipantsText(count: number): string {
    if (count <= 0) {
        return 'No Participants 😞'
    }
    if (count == 1) {
        return 'One Participant'
    }
    return `${count} Participants`

}