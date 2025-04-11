import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
export async function getLanguageFromAsyncStorage(): Promise<null, 'german' | 'english'> {
    return AsyncStorage.getItem('language');
}
export async function setLanguageToAsyncStorage(language: string) {
    await AsyncStorage.setItem('language', language);
}

type Language = 'german' | 'english';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

type LanguageProviderProps = {
    children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>('english');

    useEffect(() => {
        async function loadLanguage() {
            const storedLang = await getLanguageFromAsyncStorage();
            if (storedLang) {
                setLanguage(storedLang);
            }
        }
        loadLanguage();
    }, []);

    function changeLanguage (lang: Language) {
        console.log(lang)
        setLanguage(lang);
        setLanguageToAsyncStorage(lang);
    }


    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}
