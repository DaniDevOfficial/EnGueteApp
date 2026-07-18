import {Image, Pressable, StatusBar, Text, View} from 'react-native'
import pizzaLanding from '../assets/flags/test.png';
import bigLanding from '../assets/flags/test2.png';
import continueOnIcon from '../assets/icons/continueOnIcon.png';
import eatIcon from '../assets/icons/eatIcon.png';
import {colors} from '../theme/colors';

import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {checkAuth} from "../repo/Auth";
import {PageSpinner} from "../components/Ui/PageSpinner";
import {voidAuthToken} from "../Util";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {resetToUserScreen} from "../utility/navigation";
import {TokenPopupHandler} from "../components/Utility/JoinGroupPopup";
import {clearDatabase} from "../utility/database";

export function Home() {
    const [loading, setLoading] = useState(true);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const navigation = useNavigation();
    const showWhichImage = getLandingScreenRandomImage()

    useEffect(() => {
        checkAuthentication();

        async function checkAuthentication() {
            try {
                await checkAuth();
                resetToUserScreen(navigation)
                const token = await getPendingInviteToken();

                if (token) {
                    setInviteToken(token);
                }
            } catch (e) {
                await voidAuthToken();
                setLoading(false);
                await clearDatabase();
                //do nothing, because an error just means that the user is not logged in
            }
        }

    }, [])

    if (loading) {
        return (
            <>
                {inviteToken && (
                    <TokenPopupHandler
                        token={inviteToken}
                    />
                )}
                <PageSpinner/>
            </>
        )
    }

    const renderLandingImage = () => {
        switch (showWhichImage) {
            case ImageTypes.Pizza:
                return (
                    <Image
                        className="h-[80%] w-[85%]"
                        source={pizzaLanding}
                        accessibilityLabel="Pizza with hands"
                        resizeMode="contain"
                    />
                );

            case ImageTypes.BigWithPhone:
                return (
                    <Image
                        className="absolute bottom-0 h-[80%] w-full"
                        source={bigLanding}
                        accessibilityLabel="Big food table with phone"
                        resizeMode="contain"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-app-yellow">
            <StatusBar
                backgroundColor={colors.brand.yellow}
                barStyle="dark-content"
            />

            <View className="ml-5 mt-[79px]">
                <View>
                    <Text className="text-5xl font-bold text-black">
                        Plan meals.
                    </Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-5xl font-bold text-black">
                        Eat
                    </Text>
                    {getPilltagWithLeftIcon('together')}
                </View>
                <View>
                    <Text className="text-5xl font-bold text-black">
                        Enjoy more.
                    </Text>
                </View>
            </View>

            <View className="flex-1 items-center">
                {renderLandingImage()}
            </View>

            <View className="absolute bottom-0 left-0 right-0 mb-8 items-center">
                <Pressable
                    className="w-[80%] items-center justify-center rounded-full bg-black p-4"
                    onPress={() => {
                        navigation.navigate('signup')
                    }}
                >
                    <View className="w-[90%] flex-row items-center justify-between">
                        <Text className="text-base text-white">Get Started</Text>
                        <Image
                            source={continueOnIcon}
                            accessibilityLabel="goOn"
                            className="h-7 w-8"
                            resizeMode="contain"
                        />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

enum ImageTypes {
    Pizza,
    BigWithPhone,
}

function getLandingScreenRandomImage(): ImageTypes {
    const enumValues = Object.values(ImageTypes).filter(
        (value) => typeof value === "number"
    ) as number[];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex] as ImageTypes;
}

function getPilltagWithLeftIcon(text: string): React.JSX.Element {
    return (
        <View className="flex-row items-center justify-center gap-4 rounded-full bg-black px-4 py-1">
            <Text className="text-2xl text-white">
                {text}
            </Text>
            <View className="rounded-full bg-app-yellow p-2">
                <Image
                    className="h-9 w-9"
                    source={eatIcon}
                    accessibilityLabel="Eat Icon"
                    resizeMode="contain"
                />
            </View>
        </View>
    )
}
