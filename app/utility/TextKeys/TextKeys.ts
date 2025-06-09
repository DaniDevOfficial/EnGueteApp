import {useSettings} from "../../context/settingsContext";
import {TextKey, textKeys} from "./Keys";

export function useText(textKey: TextKey, replaceData?: Record<string, string>): string {
    const { language } = useSettings();

    let text = textKeys[textKey]?.[language] ?? textKey;

    if (replaceData) {
        for (const [key, value] of Object.entries(replaceData)) {
            text = text.replace(`[${key}]`, value);
        }
    }

    return text;
}


export function useTexts<T extends readonly TextKey[]>(textKeys: T): {[K in T[number]]: string} {
    const result = {} as { [K in T[number]]: string };

    textKeys.forEach(textKey => {
        // @ts-ignore
        result[textKey] = useText(textKey);
    });
    return result;
}


export const DEFAULT_UNDECIDED_PREFERENCE = 'undecided';

export function mealPreferenceText(preferenceText: string): string {
    if (preferenceText === DEFAULT_UNDECIDED_PREFERENCE) {
        return useText('undecided');
    }
    return preferenceText;
}