import {getText} from "./TextKeys/TextKeys";

export function getParticipantsText(count: number): string {
    if (count <= 0) {
        return getText('noParticipants')
    }
    if (count == 1) {
        return getText('oneParticipant');
    }
    return `${count} ${getText('participants')}`;

}