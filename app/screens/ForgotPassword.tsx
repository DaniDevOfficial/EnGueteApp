import React, {useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {showToast} from "../components/Ui/Toast";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {resetPassword} from "../repo/Auth";
import {colors} from '../theme/colors';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const text = useTexts(['somethingWentWrong', 'pleaseTryAgain', 'checkYourInbox', 'ifAnAccountExistsYouWillRecieveAResetEmail', 'forgotPassword', 'pleaseEnterEmailForResetLink', 'sendResetLink', 'back', 'enterEmail', 'missingEmail'])

    async function handleSubmit() {
        if (!email) {
            showToast({
                title: text.missingEmail,
                description: text.enterEmail,
                status: 'warning',
            });
            return;
        }

        try {
            setLoading(true);

            await resetPassword(email);
            await new Promise(resolve => setTimeout(resolve, 800));

            showToast({
                title: text.checkYourInbox,
                description: text.ifAnAccountExistsYouWillRecieveAResetEmail,
                status: 'success',
            });

            navigation.goBack();
        } catch (e) {
            showToast({
                title: text.somethingWentWrong,
                description: text.pleaseTryAgain,
                status: 'error',
            });
        } finally {
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
                <View className="flex-1 items-center justify-center px-6 py-10">
                    <View className="w-full max-w-md items-center gap-6">
                        <View className="items-center gap-2">
                            <Text className="text-center text-3xl font-bold text-black">
                                {text.forgotPassword}?
                            </Text>
                            <Text className="text-center text-base text-gray-500">
                                {text.pleaseEnterEmailForResetLink}
                            </Text>
                        </View>

                        <View className="w-full gap-1">
                            <Text className="text-sm font-medium text-gray-700">
                                Email
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={text.enterEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                            />
                        </View>

                        <Pressable
                            className="w-full items-center rounded-[30px] bg-app-orange py-3 shadow-md active:opacity-60"
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.surface.DEFAULT}/>
                            ) : (
                                <Text className="text-base font-medium text-white">
                                    {text.sendResetLink}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                            <Text className="text-sm text-gray-500 underline">
                                {text.back}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
