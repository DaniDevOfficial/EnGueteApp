import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import {useToast} from "native-base";
import {CreateNewAccount} from "../repo/Auth";
import {useNavigation} from "@react-navigation/native";
import {useTexts} from "../utility/TextKeys/TextKeys";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {showToast} from "../components/Ui/Toast";
import {FRONTEND_ERRORS, useErrorText} from "../utility/Errors";

export function Signup() {
    const [username, setUsername] = useState('Home2');
    const [password, setPassword] = useState('Dani1-123');
    const [email, setEmail] = useState('david.bischof.db@gmail.com');
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
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center justify-center py-10" >
                    <View className="w-full items-center gap-10">
                        <View className="w-full items-center gap-2">
                            <Text className="text-3xl font-bold text-black">
                                {text.createNewAccountSlogan}!
                            </Text>
                            <Text className="w-[90%] text-center text-base text-black">
                                {text.createNewAccountInfoText}!
                            </Text>
                        </View>

                        <View className="w-full items-center gap-2">
                            <View className="w-full gap-1">
                                <Text className="text-sm font-medium text-gray-700">
                                    {text.username}
                                </Text>
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder={text.enterUsername}
                                    className="rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View className="w-full gap-1">
                                <Text className="text-sm font-medium text-gray-700">
                                    {text.email}
                                </Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={text.enterEmail}
                                    className="rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View className="w-full gap-1">
                                <Text className="text-sm font-medium text-gray-700">
                                    {text.password}
                                </Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder={text.enterPassword}
                                    className="rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <View className="w-full items-center gap-5">
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 shadow-md active:opacity-60"
                                onPress={handleSubmit}
                            >
                                <Text className="text-base font-medium text-white">
                                    {text.createNewAccount}
                                </Text>
                            </Pressable>

                            <Text className="text-base text-black">
                                {text.or}
                            </Text>

                            <Pressable
                                className="w-full items-center rounded-[30px] bg-white border border-app-orange py-3 shadow-sm active:opacity-60"
                                onPress={() => {
                                    navigation.navigate('login')
                                }}
                            >
                                <Text className="text-base font-medium text-black">
                                    {text.orLogin}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
