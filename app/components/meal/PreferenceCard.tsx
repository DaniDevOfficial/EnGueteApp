import React, {useState} from 'react';
import {Box, Button, Flex, FormControl, Input, Modal, Pressable, Switch, Text, useToast} from 'native-base';
import {MealPreference, saveMealPreference} from "../../repo/Meal";
import {ForbiddenError, FRONTEND_ERRORS, NotFoundError, UnauthorizedError, useErrorText} from "../../utility/Errors";
import {useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {showToast} from "../UI/Toast";
import {resetToUserScreen} from "../../utility/navigation";


export function PreferenceCard({mealParticipants}: { mealParticipants: MealPreference }) {
    const toast = useToast();
    const getError = useErrorText();
    const text = useTexts(['error', 'errorPleaseEnterCorrectText', 'save', 'cancel', 'editMealPreference']);
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState<null | string>(mealParticipants.preference);
    const [newIsCook, setNewIsCook] = useState<null | boolean>(mealParticipants.isCook);

    function handlePress() {
        setModalVisible(true);
    }

    async function handleSave() {

        if (mealParticipants.isCook === newIsCook && mealParticipants.preference === newPreference) {
            setModalVisible(false);
            return;
        }

        let preferenceParam = newPreference;
        if (mealParticipants.preference === newPreference) {
            preferenceParam = null;
        }

        let isCookParam = newIsCook;
        if (mealParticipants.isCook === newIsCook) {
            isCookParam = null;
        }

        try {
            const res = await saveMealPreference(mealParticipants.userId, mealParticipants.mealId, preferenceParam, isCookParam);
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
                    <Modal.Header>Edit Meal Preference</Modal.Header>
                    <Modal.Body>

                            <FormControl>
                                <FormControl.Label>New Preference</FormControl.Label>
                                <Input
                                    value={newPreference ?? ''}
                                    onChangeText={setNewPreference}
                                    placeholder="Enter new meal preference"
                                />
                            </FormControl>
                            <FormControl display={'flex'} alignItems={'flex-start'}>

                                <FormControl.Label>Is Cook 👨‍🍳</FormControl.Label>
                                <Switch
                                    isChecked={newIsCook ?? false}
                                    onChange={(e) => setNewIsCook(e.nativeEvent.value)}
                                />
                            </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={handleSave}>Save</Button>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Pressable>
    );
}
