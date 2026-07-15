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
import {SignIntoAccount} from "../repo/Auth";
import {useNavigation} from "@react-navigation/native";
import {resetToUserScreen} from "../utility/navigation";
import {useTexts} from "../utility/TextKeys/TextKeys";

import {getPendingInviteToken} from "../utility/DeepLinking";
import {useErrorText} from "../utility/Errors";
import {showToast} from "../components/Ui/Toast";

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
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center justify-center py-10">
                    <View className="w-full items-center gap-5">
                        <View className="w-[90%] items-center gap-2">
                            <Text className="text-3xl font-bold text-black">
                                {text.welcomeBack}!
                            </Text>
                            <Text className="text-center text-base text-black">
                                {text.welcomeBackInfoText}!
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

                            <Pressable
                                className="self-start"
                                onPress={() => {
                                    navigation.navigate('forgotPassword')
                                }}
                            >
                                <Text className="text-xs text-app-gray-500 underline">
                                    forgot password?
                                </Text>
                            </Pressable>
                        </View>

                        <View className="w-full items-center gap-5">
                            <Pressable
                                className="w-full items-center rounded-[30px] bg-app-orange py-3 shadow-md active:opacity-60"
                                onPress={handleSubmit}
                            >
                                <Text className="text-base font-medium text-white">
                                    {text.login}
                                </Text>
                            </Pressable>

                            <Text className="text-base text-black">
                                {text.or}
                            </Text>

                            <Pressable
                                className="w-full items-center rounded-[30px] border border-app-orange bg-white py-3 shadow-sm active:opacity-60"
                                onPress={() => {
                                    navigation.navigate('signup')
                                }}
                            >
                                <Text className="text-base font-medium text-black">
                                    {text.createAnAccount}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
