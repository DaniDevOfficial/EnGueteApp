import { useLanguage } from "../../context/languageContext";
import { TextKey, textKeys } from "./Keys";

export function useText(textKey: TextKey, replaceData?: Record<string, string>): string {
    const { language } = useLanguage();

    let text = textKeys[textKey]?.[language] ?? textKey;

    if (replaceData) {
        for (const [key, value] of Object.entries(replaceData)) {
            text = text.replace(`[${key}]`, value);
        }
    }

    return text;
}



export function mealPreferenceText(preferenceText: string): string {
    if (preferenceText === 'undecided') {
        return useText('undecided');
    }
    return preferenceText;
}