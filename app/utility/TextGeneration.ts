import {useText} from "./TextKeys/TextKeys";

export function getParticipantsText(count: number): string {
    if (count <= 0) {
        return useText('noParticipants')
    }
    if (count == 1) {
        return useText('oneParticipant');
    }
    return `${count} ${useText('participants')}`;

}