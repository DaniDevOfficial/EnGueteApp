import {Box, HStack, Pressable, ScrollView, Text} from "native-base";
import React, {useEffect, useRef} from "react";
import {useText} from "../../utility/TextKeys/TextKeys";
// @ts-ignore
import germanFlag from '../../assets/flags/german.png';
// @ts-ignore
import englishFlag from '../../assets/flags/english.png';
import {Animated} from "react-native";
import {Language, useSettings} from "../../context/settingsContext";

export function LanguageSelector() {
    const settings = useSettings();

    function selectLanguage(language: Language) {
        settings.setLanguage(language);
    }

    const renderLanguageOption = (languageCode: Language, flagSource: string, label: string) => {
        const isSelected = settings.language === languageCode;
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
        <Box flex={1}>
            <Text mb={2} fontSize={'xl'} fontWeight="bold">
                {useText('language')}
            </Text>


            <Box
                borderRadius={10}
            >



            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <HStack space={2} overflow={'auto'}>
                    {renderLanguageOption('german', germanFlag, 'Deutsch')}
                    {renderLanguageOption('english', englishFlag, 'English')}
                </HStack>

            </ScrollView>
            </Box>
        </Box>
    );
}
