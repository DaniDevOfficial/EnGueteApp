import React, {useEffect, useRef, useState} from "react";
import {Box, HStack, Pressable, ScrollView, Text} from "native-base";
import {Animated} from "react-native";
import {useText} from "../../utility/TextKeys/TextKeys";
import lightMode from "../../assets/icons/lightmode.png";
import darkMode from "../../assets/icons/darkmode.png";
import {Theme, useSettings} from "../../context/settingsContext";


export function ThemeSelector() {
    const settings = useSettings();
    function selectLanguage(theme: Theme) {
        settings.setTheme(theme);
    }

    const renderImageOption = (theme: Theme, imageSource: string, label: string) => {
        const isSelected = settings.theme === theme;
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
            outputRange: ['transparent', '#bfdbfe'],
        });

        return (
            <Pressable key={theme} onPress={() => selectLanguage(theme)}>
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
                        source={imageSource}
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
        <Box flex={1} alignItems={'center'}>
            <Text mb={2} fontSize={'xl'}  fontWeight="bold" >
                {useText('language')}
            </Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <HStack space={2} overflow={'auto'}>
                    {renderImageOption('german', lightMode, 'Deutsch')}
                    {renderImageOption('english', darkMode, 'English')}
                </HStack>

            </ScrollView>
        </Box>
    );
}