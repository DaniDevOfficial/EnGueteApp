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
import { Alert } from 'react-native';
import {SignIntoAccount} from "../repo/Auth";
import {useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../utility/navigation";
import {useText} from "../utility/TextKeys/TextKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {JoinGroupWithToken} from "../repo/group/Invites";

export function Login() {
    const [username, setUsername] = useState('Dani1-123');
    const [password, setPassword] = useState('Dani1-123');
    const [error, setError] = useState('');
    const navigation = useNavigation()
    async function handleSubmit() {
        setError('');
        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }
        try {
            const res = await SignIntoAccount(username, password)
            resetToUserScreen(navigation)
            await handleInviteToken(navigation)
        } catch (e) {
            setError(e.message);
            //TODO: Make some toasts
        }
    };

    return (
        <Center flex={1} bg="coolGray.100">
            <Box safeArea p="5" py="8" w="90%" maxW="290" bg="white" rounded="lg" shadow={2}>
                <Heading size="lg" fontWeight="600" color="coolGray.800" textAlign="center">
                    {useText('welcomeBack')}
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs" textAlign="center">
                    {useText('pleaseSignIn')}
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
                        <FormControl.Label>Password</FormControl.Label>
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
                        {useText('login')}
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
                                    {useText('orCreateAnAccount')}
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


export async function handleInviteToken(navigation) {
    const token = await AsyncStorage.getItem('pendingInviteToken');
    if (!token) {
        console.log('📥 No pending invite token found');
        return;
    }

    setTimeout(() => {
        Alert.alert('🎉 Group Invite', `You were invited with token: ${token}`, [
            {
                text: 'Join Group',
                onPress: () => handleJoiningGroup(token, navigation),
            },
            { text: 'Maybe later', style: 'cancel' },
        ]);
    }, 500);

}

async function handleJoiningGroup(token: string, navigation) {
    const response = await JoinGroupWithToken(token);
        //TODO: error handeling
    navigation.navigate('group', {
        screen: 'groupDetails',
        params: {
            groupId: response.groupId,
        },
    });
}