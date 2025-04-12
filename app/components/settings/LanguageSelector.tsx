import { Box, Pressable, Text, HStack } from "native-base";
import React, {useEffect, useRef} from "react";
import {useText} from "../../utility/TextKeys/TextKeys";
import germanFlag from '../../assets/flags/german.png';
import englishFlag from '../../assets/flags/english.png';
import { Animated } from "react-native";
import {useLanguage} from "../../context/languageContext";

export function LanguageSelector() {
    const { language } = useLanguage();
    const languageContext = useLanguage();
    function selectLanguage(language: 'german' | 'english') {
        languageContext.setLanguage(language);
    }

    const renderLanguageOption = (languageCode: string, flagSource: string, label: string) => {
        const isSelected = language === languageCode;
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
        }, [isSelected]);

        const backgroundColor = bgAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#bfdbfe'], // blue.200 equivalent
        });

        return (
            <Pressable key={languageCode} onPress={() => selectLanguage(languageCode)}>
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
                        alt={label}
                        style={{
                            width: sizeAnim,
                            height: sizeAnim,
                            resizeMode: 'contain',
                        }}
                    />
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <Box>
            <Text mb={2}>
                {useText('language')}
            </Text>
            <HStack space={2}>
                {renderLanguageOption('german', germanFlag, 'Deutsch')}
                {renderLanguageOption('english', englishFlag, 'English')}
            </HStack>
        </Box>
    );
}
