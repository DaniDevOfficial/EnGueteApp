import React, {useState} from 'react';
import {Modal, Button, FormControl, Input, Box, Text, Pressable, Flex, Switch} from 'native-base';
import {MealParticipants, saveMealPreference} from "../../repo/Meal";
import {ForbiddenError, UnauthorizedError} from "../../utility/Errors";
import {CommonActions, NavigationProp, useNavigation} from "@react-navigation/native";
import {handleLogoutProcedure} from "../../Util";
import {resetToHomeScreen} from "../../utility/navigation";


export function PreferenceCard({mealParticipants}: { mealParticipants: MealParticipants }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState<null|string>(mealParticipants.preference);
    const [newIsCook, setNewIsCook] = useState<null|boolean>(mealParticipants.isCook);

    const navigation = useNavigation();

    function handlePress() {
        setModalVisible(true);
    }

    async function handleSave() {

        if (mealParticipants.isCook === newIsCook &&  mealParticipants.preference === newPreference) {
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
        //TODO: some logic for fancy update of the cah
        } catch (e) {
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }

            if (e instanceof ForbiddenError) {
                console.log('This action is forbidden for this user')
                //TODO: toast
            }
            console.log(e.message)

        }


        setModalVisible(false);
    }

    return (
        <Pressable onPress={handlePress} alignItems="center">
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={'95%'} my={2}>
                <Flex justifyContent={"space-between"} alignItems={'center'} flexDir={'row'} width={"100%"}>
                    <Text>{mealParticipants.username}</Text>
                    <Text>{mealParticipants.preference}</Text>
                    {mealParticipants.isCook && <Text>👨‍🍳</Text>}
                </Flex>
            </Box>

            <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Header>Edit Meal Preference</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>New Preference</FormControl.Label>
                            <Input
                                value={newPreference}
                                onChangeText={setNewPreference}
                                placeholder="Enter new meal preference"
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Is Cook 👨‍🍳</FormControl.Label>
                            <Switch
                                isChecked={newIsCook}
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
