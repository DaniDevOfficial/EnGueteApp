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
import {CustomButton} from "../components/UI/CustomButton";

export function Login() {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation()

    const text = useTexts(['error', 'welcomeBack', 'welcomeBackInfoText', 'pleaseSignIn', 'username', 'or', 'enterUsername', 'password', 'enterPassword', 'login', 'createAnAccount', 'allFieldsAreRequired']);
    const toast = useToast();
    const getError = useErrorText();

    async function handleSubmit() {
        setLoading(true);
        if (!username || !password) {
            showToast({
                toast,
                title: text.error,
                description: text.allFieldsAreRequired,
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
            setLoading(false);
        }
    }

    return (
        <>
            <Flex
                justifyContent="center"
                alignItems="center"
                py={10}
            >

                <VStack space={5} alignItems="center" w={'100%'}>
                    <VStack space={2} alignItems="center" w={'90%'}>

                        <Text
                            fontSize={'3xl'}
                            fontWeight={'bold'}
                        >
                            {text.welcomeBack}!
                        </Text>
                        <Text
                            textAlign="center"
                        >
                            {text.welcomeBackInfoText}!
                        </Text>
                    </VStack>

                    <VStack space={2} alignItems="center" w={'100%'}>
                        <FormControl>
                            <FormControl.Label>{text.username}</FormControl.Label>
                            <Input
                                value={username}
                                onChangeText={(text) => setUsername(text)}
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
                                p={3}
                                placeholder={text.enterPassword}
                                type="password"
                                rounded="md"
                            />
                        </FormControl>
                        <Pressable
                            onPress={() => {
                                navigation.navigate('forgotPassword')
                            }}>
                            <Text color={'gray.500'} underline={true} fontSize={'xs'}>
                                forgot password?
                            </Text>
                        </Pressable>
                    </VStack>
                    <VStack space={5} alignItems="center" w={'100%'}>
                        <CustomButton
                            w={'100%'}
                            onPress={handleSubmit}
                        >
                            {text.login}
                        </CustomButton>

                        <Text>
                            {text.or}
                        </Text>

                        <CustomButton w={'100%'}
                                      onPress={() => {
                                          navigation.navigate('signup')
                                      }}
                                      onlyOutline={true}
                                      backgroundColor={'coolGray.100'}
                        >
                            <Text>
                                {text.createAnAccount}
                            </Text>
                        </CustomButton>
                    </VStack>

                </VStack>
            </Flex>
        </>
    );
}


