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
    VStack
} from "native-base";
import {CreateNewAccount} from "../repo/Auth";
import {saveAuthToken} from "../Util";
import {useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../utility/navigation";
import {useText} from "../utility/TextKeys/TextKeys";

export function Signup() {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [email, setEmail] = useState('1232@gmail.com');

    const [error, setError] = useState('');
    const navigation = useNavigation();
    async function handleSubmit() {
        setError('');
        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }
        try {
            const response = await CreateNewAccount(username, email ,password)
            resetToUserScreen(navigation)
        } catch (e) {
            setError(e.message);
            //TODO: Make some toasts
        }
    }

    return (
        <Center flex={1} bg="coolGray.100">
            <Box safeArea p="5" py="8" w="90%" maxW="290" bg="white" rounded="lg" shadow={2}>
                <Heading size="lg" fontWeight="600" color="coolGray.800" textAlign="center">
                    {useText('newAccountGreetingsText')}
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs" textAlign="center">
                    {useText('createNewAccount')}
                </Heading>

                <VStack space={4} mt="5">
                    {error ? (
                        <Text color="red.500" fontSize="sm" textAlign="center">
                            {error}
                        </Text>
                    ) : null}

                    <FormControl>
                        <FormControl.Label>{useText('username')}</FormControl.Label>
                        <Input
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            variant="filled"
                            p={3}
                            placeholder={useText('enterUsername')}
                            rounded="md"
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>{useText('email')}</FormControl.Label>
                        <Input
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            variant="filled"
                            p={3}
                            placeholder={useText('enterEmail')}
                            type="text"
                            rounded="md"
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>{useText('password')}</FormControl.Label>
                        <Input
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            variant="filled"
                            p={3}
                            placeholder={useText('enterPassword')}
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
                        {useText('createNewAccount')}
                    </Button>
                </VStack>
                <Pressable
                    onPress={() => {navigation.navigate('login')}}
                >
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Box w="90%" maxW="290" mt={5}>
                            <HStack alignItems="center" space={2}>
                                <Divider flex={1} bg="coolGray.300"/>
                                <Text fontSize="sm" color="coolGray.400">
                                    {useText('orLogin')}
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
