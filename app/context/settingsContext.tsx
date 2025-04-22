import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
export async function getLanguageFromAsyncStorage(): Promise<null, 'german' | 'english'> {
    return AsyncStorage.getItem('language');
}
export async function setLanguageToAsyncStorage(language: string) {
    await AsyncStorage.setItem('language', language);
}
// @ts-ignore
export async function getThemeFromAsyncStorage(): Promise<null, Theme> {
    return AsyncStorage.getItem('theme');
}
export async function setThemeToAsyncStorage(theme: string) {
    await AsyncStorage.setItem('theme', theme);
}

export type Language = 'german' | 'english';
export type Theme = 'light' | 'dark';

type SettingsContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings(): SettingsContextType {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

type SettingsProviderProp = {
    children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProp) {
    const [language, setLanguage] = useState<Language>('english');
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        async function loadSettings() {
            const storedLang = await getLanguageFromAsyncStorage();
            if (storedLang) {
                setLanguage(storedLang);
            }

            const storedTheme = await getThemeFromAsyncStorage();
            if (storedTheme) {
                setTheme(storedTheme);
            } else {
                setTheme('light');
            }
        }
        loadSettings();
    }, []);

    function changeLanguage (lang: Language) {
        setLanguage(lang);
        setLanguageToAsyncStorage(lang);
    }

    function changeTheme(theme: Theme) {
        setTheme(theme);
        setThemeToAsyncStorage(theme);
    }

    return (
        <SettingsContext.Provider value={{ language, setLanguage: changeLanguage, theme, setTheme: changeTheme }}>
            {children}
        </SettingsContext.Provider>
    );
}
