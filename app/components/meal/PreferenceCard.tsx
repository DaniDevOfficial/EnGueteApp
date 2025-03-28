import React, { useState } from 'react';
import {Modal, Button, FormControl, Input, Box, Text, Pressable, Flex} from 'native-base';
import {MealParticipants} from "../../repo/Meal";

export function PreferenceCard({ mealParticipants }: { mealParticipants: MealParticipants }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState(mealParticipants.preference);

    function handlePress() {
        setModalVisible(true);
    }

    function handleSave() {
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
