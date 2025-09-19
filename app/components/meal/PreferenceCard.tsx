import React, {useState} from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    HStack,
    Image,
    Input,
    Modal,
    Pressable,
    Switch,
    Text,
    useToast, VStack
} from 'native-base';
import {MealPreference, saveMealPreference} from "../../repo/Meal";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {resetToUserScreen} from "../../utility/navigation";
import {CustomButton} from "../UI/CustomButton";

export function PreferenceCard({mealParticipants, forceRefresh}: {
    mealParticipants: MealPreference,
    forceRefresh: (arg0: boolean) => Promise<void>
}) {
    const toast = useToast();
    const getError = useErrorText();
    const text = useTexts(['error', 'errorPleaseEnterCorrectText', 'save', 'cancel', 'editPreferences', 'newPreference', 'isCook']);
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState<string>(mealPreferenceText(mealParticipants.preference));
    const [newIsCook, setNewIsCook] = useState<null | boolean>(mealParticipants.isCook);

    function handlePress() {
        setModalVisible(true);
    }

    async function handleSave() {

        if (mealParticipants.isCook === newIsCook && mealParticipants.preference === newPreference) {
            setModalVisible(false);
            return;
        }

        let preferenceParam: string | null = newPreference;
        if (mealParticipants.preference === newPreference) {
            preferenceParam = null;
        }

        let isCookParam = newIsCook;
        if (mealParticipants.isCook === newIsCook) {
            isCookParam = null;
        }

        try {
            const res = await saveMealPreference(mealParticipants.userId, mealParticipants.mealId, preferenceParam, isCookParam);
            await forceRefresh(true)
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof NotFoundError) {
                if (e.message === FRONTEND_ERRORS.GROUP_DOES_NOT_EXIST_ERROR) {
                    resetToUserScreen(navigation)
                    return;
                }
                return;
            }
        }


        setModalVisible(false);
    }

    return (
        <Pressable onPress={handlePress}>

            <Box
                shadow={"1"}
                borderColor={"light.200"}
                borderWidth={1}
                borderRadius="md"
                backgroundColor="light.100"
                p={2}
            >
                <HStack
                    space={3}
                    alignItems={'center'}
                >
                    <Image
                        source={{uri: "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png"}}
                        alt="Profile picture"
                        width="50px"
                        height="50px"
                        borderRadius="full"
                    />
                    <VStack>

                        <HStack
                            space={3}
                        >
                            <Text fontSize="xl" fontWeight="bold">{mealParticipants.username}</Text>
                            {mealParticipants.isCook && <PillTag text={'👨‍🍳'} colorScheme={'orange'}/>}
                        </HStack>
                        <Text
                            color="coolGray.600">{mealParticipants.preference ? mealPreferenceText(mealParticipants.preference) : text.errorPleaseEnterCorrectText}</Text>
                    </VStack>
                </HStack>
            </Box>


            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Body>

                        <VStack space={4}>
                            <VStack space={2} alignItems="center" width='100%'>

                                <Text
                                    fontSize={'2xl'}
                                    fontWeight={'bold'}
                                    textAlign={'center'}
                                >
                                    {text.editPreferences}
                                </Text>
                                <FormControl>
                                    <FormControl.Label>{text.newPreference}</FormControl.Label>
                                    <Input
                                        value={newPreference}
                                        onChangeText={setNewPreference}
                                        placeholder={text.newPreference}
                                    />
                                </FormControl>
                                <FormControl display={'flex'} alignItems={'center'}  justifyContent={'space-between'} flexDir={'row'}>

                                    <FormControl.Label>{text.isCook}</FormControl.Label>
                                    <Switch
                                        colorScheme={'orange'}
                                        isChecked={newIsCook ?? false}
                                        onChange={(e) => setNewIsCook(e.nativeEvent.value)}
                                    />
                                </FormControl>
                            </VStack>
                            <VStack space={2} alignItems="center" width='100%'>

                                <CustomButton
                                    width={'100%'}
                                    isLoading={false}
                                    onPress={handleSave}
                                    colorScheme="primary"
                                >
                                    {text.save}
                                </CustomButton>
                                <CustomButton width={'100%'} onlyOutline={true} onPress={() => setModalVisible(false)}>
                                    <Text>
                                        {text.cancel}
                                    </Text>
                                </CustomButton>

                            </VStack>
                        </VStack>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Pressable>
    );
}
