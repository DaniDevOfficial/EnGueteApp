import {Box, Flex, HStack, Image, Pressable, StatusBar, Text, VStack} from 'native-base'
import pizzaLanding from '../assets/flags/test.png';
import bigLanding from '../assets/flags/test2.png';
import continueOnIcon from '../assets/icons/continueOnIcon.png';
import eatIcon from '../assets/icons/eatIcon.png';

import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {checkAuth} from "../repo/Auth";
import {PageSpinner} from "../components/UI/PageSpinner";
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
                        width={'85%'}
                        height={'80%'}
                        source={pizzaLanding}
                        alt="Pizza with hands"
                        resizeMode="contain"
                    />
                );

            case ImageTypes.BigWithPhone:
                return (
                    <Image
                        width={'100%'}
                        height={'80%'}
                        bottom={0}
                        source={bigLanding}
                        alt="Big food table with phone"
                        position={'absolute'}
                    />
                );

            default:
                return null;
        }
    };

    return (

        <Box flex={1} bg="#ffd043">

            <StatusBar
                backgroundColor="#ffd043"
                barStyle="dark-content"
            />
            <Box marginTop={79} marginLeft={5}>
                <VStack space={0}>
                    <Box>
                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Plan meals.
                        </Text>
                    </Box>
                    <HStack
                        alignItems={'center'}
                        space={4}
                    >

                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Eat
                        </Text>
                        <Box>
                            {getPilltagWithLeftIcon('together')}
                        </Box>
                    </HStack>
                    <Box>
                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Enjoy more.
                        </Text>
                    </Box>

                </VStack>
            </Box>
            <Box flex={1} alignItems={'center'}>
                {renderLandingImage()}
            </Box>
            <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                alignItems="center"
                mb={8}
            >
                <Pressable
                    width="80%"
                    justifyContent="center"
                    backgroundColor="black"
                    alignItems="center"
                    p={4}
                    borderRadius="100"
                    onPress={() => {
                        navigation.navigate('signup')
                    }}
                >
                    <Flex
                        justifyContent="space-between"
                        flexDir={'row'}
                        alignItems="center"
                        width="90%"
                    >
                        <Text color="white">Get Started</Text>
                        <Image
                            source={continueOnIcon}
                            alt="goOn"
                            height={'70%'}
                            width={'10%'}
                            resizeMode="contain"
                        />

                    </Flex>
                </Pressable>
            </Box>
        </Box>


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
        <HStack
            justifyContent="center"
            backgroundColor="black"
            alignItems="center"
            borderRadius="100"
            p={4}
            py={1}
            space={4}
        >
            <Text color={'white'} fontSize={'2xl'}>
                {text}
            </Text>
            <Box
                padding={'8px'}
                backgroundColor={'#ffd043'}
                borderRadius="100"
            >

                <Image
                    w={'36px'}
                    h={'36px'}
                    source={eatIcon}
                    alt="Eat Icon"
                    resizeMode="contain"
                />
            </Box>

        </HStack>
    )


}


/**
 <Box flex={1} justifyContent="center" alignItems="center" p={4}>
 {inviteToken && (
 <TokenPopupHandler
 token={inviteToken}
 />
 )}
 <Text fontSize="2xl" mb={4}>Welcome to EnGuete!</Text>
 <Button onPress={() => navigation.navigate('login')} my={2}>
 <Text>{text.login}</Text>
 </Button>
 <Button onPress={() => navigation.navigate('signup')} my={2}>
 <Text>{text.signup}</Text>
 </Button>
 </Box>

 */