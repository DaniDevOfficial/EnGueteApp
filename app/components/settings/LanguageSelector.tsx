import React, {useEffect, useRef} from "react";
import {Animated, ImageSourcePropType, Pressable, ScrollView, Text, View} from "react-native";
import {useText} from "../../utility/TextKeys/TextKeys";
// @ts-ignore
import germanFlag from '../../assets/flags/german.png';
// @ts-ignore
import englishFlag from '../../assets/flags/english.png';
import {Language, useSettings} from "../../context/settingsContext";

function LanguageOption({
                            languageCode,
                            flagSource,
                            label,
                            isSelected,
                            onSelect,
                        }: {
    languageCode: Language;
    flagSource: ImageSourcePropType;
    label: string;
    isSelected: boolean;
    onSelect: (language: Language) => void;
}) {
    const sizeAnim = useRef(new Animated.Value(isSelected ? 60 : 50)).current;
    const bgAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(sizeAnim, {
            toValue: isSelected ? 60 : 50,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(bgAnim, {
            toValue: isSelected ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isSelected, sizeAnim, bgAnim]);

    const backgroundColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', '#bfdbfe'],
    });

    return (
        <Pressable onPress={() => onSelect(languageCode)}>
            <Animated.View
                style={{
                    backgroundColor,
                    padding: 8,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Animated.Image
                    source={flagSource}
                    accessibilityLabel={label}
                    style={{
                        width: sizeAnim,
                        height: sizeAnim,
                        resizeMode: 'contain',
                    }}
                />
            </Animated.View>
        </Pressable>
    );
}

export function LanguageSelector() {
    const settings = useSettings();

    function selectLanguage(language: Language) {
        settings.setLanguage(language);
    }

    return (
        <View className="flex-1">
            <Text className="mb-2 text-xl font-bold text-black">
                {useText('language')}
            </Text>

            <View className="rounded-[10px]">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                        <LanguageOption
                            languageCode="german"
                            flagSource={germanFlag}
                            label="Deutsch"
                            isSelected={settings.language === 'german'}
                            onSelect={selectLanguage}
                        />
                        <LanguageOption
                            languageCode="english"
                            flagSource={englishFlag}
                            label="English"
                            isSelected={settings.language === 'english'}
                            onSelect={selectLanguage}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
