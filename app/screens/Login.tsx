import React, {useState} from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    Heading,
    HStack,
    Input,
    Pressable,
    Text,
    useToast,
    VStack
} from "native-base";
import {SignIntoAccount} from "../repo/Auth";
import {useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../utility/navigation";
import {useTexts} from "../utility/TextKeys/TextKeys";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {TokenPopupHandler} from "../components/Utility/JoinGroupPopup";
import {useErrorText} from "../utility/Errors";
import {showToast} from "../components/UI/Toast";

export function Login() {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [inviteToken, setInviteToken] = useState<string | null>(null);

    const navigation = useNavigation()

    const text = useTexts(['error', 'welcomeBack', 'pleaseSignIn', 'username', 'enterUsername', 'password', 'enterPassword', 'login', 'orCreateAnAccount', 'bothAreRequired']);
    const toast = useToast();
    const getError = useErrorText();
    async function handleSubmit() {
        if (!username || !password) {
            showToast({
                toast,
                title: text.error,
                description: text.bothFieldsAreRequired,
                status: "warning",
            })
            return;
        }
        try {
            await SignIntoAccount(username, password)
            const token = await getPendingInviteToken();
            if (token) {
                setInviteToken(token);
            }
            resetToUserScreen(navigation)

        } catch (e) {
            showToast({
                toast,
                title: text.login,
                description: getError(e.message),
                status: "error",
            })
        }
    }

    return (
        <Center flex={1} bg="coolGray.100">
            {inviteToken && (
                <TokenPopupHandler
                    token={inviteToken}
                />
            )}
            <Box safeArea p="5" py="8" w="90%" maxW="290" bg="white" rounded="lg" shadow={2}>
                <Heading size="lg" fontWeight="600" color="coolGray.800" textAlign="center">
                    {text.welcomeBack}
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs" textAlign="center">
                    {text.pleaseSignIn}
                </Heading>

                <VStack space={4} mt="5">

                    <FormControl>
                        <FormControl.Label>{text.username}</FormControl.Label>
                        <Input
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            variant="filled"
                            p={3}
                            placeholder={text.enterUsername}
                            rounded="md"
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>{text.password}</FormControl.Label>
                        <Input
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            variant="filled"
                            p={3}
                            placeholder={text.enterPassword}
                            type="password"
                            rounded="md"
                        />
                    </FormControl>
                    <Button
                        mt="5"
                        colorScheme="primary"
                        _text={{fontSize: "md"}}
                        onPress={handleSubmit}
                    >
                        {text.login}
                    </Button>
                </VStack>
                <Pressable
                    onPress={() => {
                        navigation.navigate('signup')
                    }}
                >
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Box w="90%" maxW="290" mt={5}>
                            <HStack alignItems="center" space={2}>
                                <Divider flex={1} bg="coolGray.300"/>
                                <Text fontSize="sm" color="coolGray.400">
                                    {text.orCreateAnAccount}
                                </Text>
                                <Divider flex={1} bg="coolGray.300"/>
                            </HStack>
                        </Box>
                    </Flex>
                </Pressable>
            </Box>
        </Center>
    );
}


