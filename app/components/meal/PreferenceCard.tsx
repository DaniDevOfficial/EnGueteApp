import React, {useState} from 'react';
import {Box, Button, Flex, FormControl, Input, Modal, Pressable, Switch, Text, useToast} from 'native-base';
import {MealPreference, saveMealPreference} from "../../repo/Meal";
import {FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {resetToUserScreen} from "../../utility/navigation";

export function PreferenceCard({mealParticipants, forceRefresh}: { mealParticipants: MealPreference, forceRefresh: (arg0: boolean) => Promise<void> }) {
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
        <Pressable onPress={handlePress} alignItems="center">
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={'95%'} my={2}>
                <Flex justifyContent={"space-between"} alignItems={'center'} flexDir={'row'} width={"100%"}>
                    <Text>{mealParticipants.username}</Text>
                    {/*@ts-ignore*/}
                    <Flex gap={4} flexDir={'row'} alignItems={'center'}>
                        {mealParticipants.isCook && <Text>👨‍🍳</Text>}
                        <PillTag text={mealPreferenceText(mealParticipants.preference)}/>
                    </Flex>
                </Flex>
            </Box>

            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>{text.editPreferences}</Modal.Header>
                    <Modal.Body>

                        <FormControl>
                            <FormControl.Label>{text.newPreference}</FormControl.Label>
                            <Input
                                value={newPreference}
                                onChangeText={setNewPreference}
                                placeholder={text.newPreference}
                            />
                        </FormControl>
                        <FormControl display={'flex'} alignItems={'flex-start'}>

                            <FormControl.Label>{text.isCook}</FormControl.Label>
                            <Switch
                                isChecked={newIsCook ?? false}
                                onChange={(e) => setNewIsCook(e.nativeEvent.value)}
                            />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={handleSave}>{text.save}</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            {text.cancel}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Pressable>
    );
}
