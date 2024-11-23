import React, {useState} from 'react';
import {Box, Button, Center, Divider, Flex, FormControl, Heading, HStack, Input, Text, VStack} from "native-base";
import {SignIntoAccount} from "../repo/Auth";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        console.log(1223)
        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }
        try {
            SignIntoAccount(username, password)

        } catch (e) {
            console.log(e.message)
            setError(e.message);

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

            </Box>
        </Center>
    );
}
