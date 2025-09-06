import {Box, Flex, Image, Text, VStack} from 'native-base'
import germanFlag from '../assets/flags/test.png';
import continueOnIcon from '../assets/icons/continueOnIcon.png';

import React, {useEffect, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useTexts} from "../utility/TextKeys/TextKeys";
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

    const text = useTexts(['login', 'signup']);

    const [popupTexts] = useState(useTexts(['maybeLater', 'joinGroup', 'youWereInvited', 'groupInvite']));
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


    return (

        <Box flex={1} bg="#ffd043">

            <Box marginTop={79} marginLeft={5}>
                <VStack space={2}>
                    <Box>
                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Plan meals.
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Eat together.
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize={'5xl'} fontWeight={'bold'}>
                            Enjoy more.
                        </Text>
                    </Box>

                </VStack>
            </Box>
            <Box flex={1} alignItems={'center'}>
                <Image
                    width={'85%'}
                    height={'80%'}
                    source={germanFlag}
                    alt="Pizza with hands"
                    resizeMode="contain"
                />
            </Box>
            <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                alignItems="center"
                mb={8}
            >
                <Box
                    width="80%"
                    justifyContent="center"
                    backgroundColor="black"
                    alignItems="center"
                    p={4}
                    borderRadius="100"
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
                </Box>
            </Box>
        </Box>


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