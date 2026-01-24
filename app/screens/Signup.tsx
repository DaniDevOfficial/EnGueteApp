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
import {CreateNewAccount} from "../repo/Auth";
import {useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../utility/navigation";
import {useTexts} from "../utility/TextKeys/TextKeys";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {TokenPopupHandler} from "../components/Utility/JoinGroupPopup";
import {showToast} from "../components/UI/Toast";
import {FRONTEND_ERRORS, useErrorText} from "../utility/Errors";
import {CustomButton} from "../components/UI/CustomButton";

export function Signup() {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [email, setEmail] = useState('1232@gmail.com');
    const [error, setError] = useState('');
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const text = useTexts(['error', 'newAccountGreetingsText', 'or', 'createNewAccount', 'createNewAccountSlogan', 'createNewAccountInfoText', 'username', 'enterUsername', 'email', 'enterEmail', 'password', 'enterPassword', 'createNewAccount', 'orLogin', 'bothFieldsAreRequired', 'info']);
    const toast = useToast();
    const getError = useErrorText();

    async function handleSubmit() {
        setLoading(true);
        setError('');
        if (!username || !password) {
            showToast({
                toast,
                title: text.error,
                description: text.bothFieldsAreRequired,
                status: "error",
            })
            return;
        }
        try {
            await CreateNewAccount(username, email, password)
            const token = await getPendingInviteToken();
            if (token) {
                setInviteToken(token);
            }
            showToast({
                toast,
                title: text.info,
                description: getError(FRONTEND_ERRORS.HAS_TO_VERIFY_EMAIL_ERROR),
                status: "info",
            })
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "error",
            })
        }
        setLoading(false)
    }

    return (

        <>
            <Flex
                justifyContent="center"
                alignItems="center"
                py={10}
            >

                <VStack space={10} alignItems="center" w={'100%'}>
                    <VStack space={2} alignItems="center" w={'100%'}>

                        <Text
                            fontSize={'3xl'}
                            fontWeight={'bold'}
                        >
                            {text.createNewAccountSlogan}!
                        </Text>
                        <Text
                            width={'90%'}
                            textAlign="center"
                        >
                            {text.createNewAccountInfoText}!
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
                            <FormControl.Label>{text.email}</FormControl.Label>
                            <Input
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                p={3}
                                placeholder={text.enterEmail}
                                type="text"
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
                    </VStack>
                    <VStack space={5} alignItems="center" w={'100%'}>
                        <CustomButton
                            w={'100%'}
                            onPress={handleSubmit}
                        >
                            {text.createNewAccount}
                        </CustomButton>

                        <Text>
                            {text.or}
                        </Text>

                        <CustomButton w={'100%'}
                                      onPress={() => {
                                          navigation.navigate('login')
                                      }}
                                      onlyOutline={true}
                                      backgroundColor={'coolGray.100'}
                        >
                            <Text>
                                {text.orLogin}
                            </Text>
                        </CustomButton>
                    </VStack>

                </VStack>
            </Flex>
        </>

    );
}
