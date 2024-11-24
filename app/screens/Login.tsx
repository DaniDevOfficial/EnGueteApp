import React, {useState} from 'react';
import {Box, Button, Center, Divider, Flex, FormControl, Heading, HStack, Input, Pressable, Text, VStack} from "native-base";
import {SignIntoAccount} from "../repo/Auth";
import {saveAuthToken} from "../Util";

export function Login({navigation}: any) {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [error, setError] = useState('');

    async function handleSubmit() {
        setError('');
        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }
        try {
            const tokenData = await SignIntoAccount(username, password)
            await saveAuthToken(tokenData.token)
            navigation.navigate('user')
        } catch (e) {
            setError(e.message);
            //TODO: Make some toasts
        }
    };

    return (
        <Center flex={1} bg="coolGray.100">
            <Box safeArea p="5" py="8" w="90%" maxW="290" bg="white" rounded="lg" shadow={2}>
                <Heading size="lg" fontWeight="600" color="coolGray.800" textAlign="center">
                    Welcome Back
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs" textAlign="center">
                    Please sign in to continue
                </Heading>

                <VStack space={4} mt="5">
                    {error ? (
                        <Text color="red.500" fontSize="sm" textAlign="center">
                            {error}
                        </Text>
                    ) : null}

                    <FormControl>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            variant="filled"
                            p={3}
                            placeholder="Enter your username"
                            rounded="md"
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            variant="filled"
                            p={3}
                            placeholder="Enter your password"
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
                        Sign In
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
                                    Or Create an account
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
