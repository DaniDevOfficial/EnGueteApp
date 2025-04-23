import {BACKEND_URL} from '@env';
import {getBasicAuthHeader} from "../../utility/Auth";
import {timeoutPromiseFactory} from "../../Util";
import {handleDefaultResponseAndHeaders} from "../../utility/Response";


export interface InviteToken {
    inviteToken: string,
    expiresAt: string,
}

export async function GetAllInviteTokensOfAGroup(groupId: string): Promise<InviteToken[]> {
    const url = `${BACKEND_URL}groups/invite?groupId=${groupId}`;
    const timeoutPromise = timeoutPromiseFactory();
    const fetchPromise = fetch(url, {
        method: 'GET',
        headers: await getBasicAuthHeader(),
    });


    const res: Response = await Promise.race([fetchPromise, timeoutPromise]);
    await handleDefaultResponseAndHeaders(res)
    return await res.json() ?? [];
}

export async function createInviteToken(groupId: string): Promise<InviteToken> {

}