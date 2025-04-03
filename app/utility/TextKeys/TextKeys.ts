import * as Localization from 'expo-localization';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TextKey, textKeys} from "./Keys";

let currentLanguage =  'english'; // Default to system language
setLanguageFromAsyncStorage() // this is a hack to set the language from async storage, otherwise development wil always be in english
// @ts-ignore
export async function getLanguageFromAsyncStorage(): Promise<null, 'german' | 'english'> {
    return AsyncStorage.getItem('language');
}
export async function setLanguageToAsyncStorage(language: string) {
    await AsyncStorage.setItem('language', language);
}

export async function setLanguageFromAsyncStorage() {
    const language = await getLanguageFromAsyncStorage();
    if (language) {
        setLanguage(language);
    } else {
        currentLanguage = Localization.locale.includes('de') ? 'german' : 'english';
        await setLanguageToAsyncStorage(currentLanguage);
    }
}

export function setLanguage(lang: 'german' | 'english') {
    currentLanguage = lang;
}

export function getLanguage(): 'german' | 'english' {
    if (currentLanguage === 'german') {
        return 'german';
    }

    return 'english';
}

export function getText(textKey: TextKey, replaceData?: Record<string, string>): string {
    if (!textKeys[textKey]) {
        return textKey;
    }
    const language = getLanguage();
    let text = textKeys[textKey][language];
    if (!replaceData) {
        return text;
    }

    for (const [key, value] of Object.entries(replaceData)) {
        text = text.replace(`[${key}]`, value);
    }

    return text;
}

export function mealPreferenceText(preferenceText: string): string {
    if (preferenceText === 'undecided') {
        return getText('undecided');
    }
    return preferenceText;
}