import {ErrorTextKey, ErrorTextType} from "./Keys/ErrorText";
import {GeneralTextKey, GeneralTextType} from "./Keys/GeneralText";
import {TimeTextKey, TimeTextType} from "./Keys/TimeText";
import {AuthTextKey, AuthTextType} from "./Keys/AuthText";
import {MealTextKey, MealTextType} from "./Keys/MealText";
import {GroupTextKey, GroupTextType} from "./Keys/GroupText";
import {MiscTextKey, MiscTextType} from "./Keys/MiscText";
import {UserTextKey, UserTextType} from "./Keys/UserText";

export type TextKey =
    | GeneralTextType
    | MiscTextType
    | AuthTextType
    | TimeTextType
    | GroupTextType
    | MealTextType
    | UserTextType
    | ErrorTextType
    ;

export type TextKeysInterface = {
    [K in TextKey]: {
        german: string;
        english: string;
    };
};


export const textKeys: TextKeysInterface = {
    ...GeneralTextKey,
    ...MiscTextKey,
    ...AuthTextKey,
    ...TimeTextKey,
    ...GroupTextKey,
    ...MealTextKey,
    ...UserTextKey,
    ...ErrorTextKey,
}

