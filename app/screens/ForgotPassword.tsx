import React, {useState} from 'react';
import {
    Flex,
    VStack,
    Text,
    FormControl,
    Input,
    useToast
} from "native-base";
import {useNavigation} from "@react-navigation/native";
import {CustomButton} from "../components/UI/CustomButton";
import {showToast} from "../components/UI/Toast";
import {useTexts} from "../utility/TextKeys/TextKeys";

// import {requestPasswordReset} from "../repo/Auth"; // 👈 implement later

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const toast = useToast();
    const text = useTexts(['somethingWentWrong', 'pleaseTryAgain', 'checkYourInbox', 'ifAnAccountExistsYouWillRecieveAResetEmail', 'forgotPassword', 'pleaseEnterEmailForResetLink', 'sendResetLink', 'back', 'enterEmail', 'missingEmail'])


    async function handleSubmit() {
        if (!email) {
            showToast({
                toast,
                title: text.missingEmail,
                description: text.enterEmail,
                status: 'warning',
            });
            return;
        }

        try {
            setLoading(true);

            // await requestPasswordReset(email);
            await new Promise(resolve => setTimeout(resolve, 800));

            showToast({
                toast,
                title: text.checkYourInbox,
                description: text.ifAnAccountExistsYouWillRecieveAResetEmail,
                status: 'success',
            });

            navigation.goBack();
        } catch (e) {
            showToast({
                toast,
                title: text.somethingWentWrong,
                description: text.pleaseTryAgain,
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Flex justifyContent="center" alignItems="center" py={10}>
            <VStack space={6} w="90%" alignItems="center">
                <VStack space={2} alignItems="center">
                    <Text fontSize="3xl" fontWeight="bold">
                        {text.forgotPassword}? 🔐
                    </Text>
                    <Text textAlign="center" color="gray.500">
                        {text.pleaseEnterEmailForResetLink}
                    </Text>
                </VStack>

                <FormControl w="100%">
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        p={3}
                        rounded="md"
                    />
                </FormControl>

                <CustomButton
                    w="100%"
                    onPress={handleSubmit}
                    isLoading={loading}
                >
                    {text.sendResetLink}
                </CustomButton>

                <Text
                    fontSize="sm"
                    color="gray.500"
                    underline
                    onPress={() => navigation.goBack()}
                >
                    {text.back}
                </Text>
            </VStack>
        </Flex>
    );
}
