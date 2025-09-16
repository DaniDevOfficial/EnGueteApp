import {Box, HStack, Modal, Text} from "native-base";
import {useText, useTexts} from "../../utility/TextKeys/TextKeys";
import React, {useState} from "react";
import { CustomButton } from "../UI/CustomButton";

export function CreateGroup() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const text = useTexts(['createNewGroup']);

    async function handleCreateNewGroup() {
        setIsSaving(true);
        setTimeout(() => {

            setIsSaving(false);
        }, 1000)
    }

    return (
        <>

            <CustomButton onPress={() => setModalVisible(true)}>
                <HStack flexDir='row' space={2} justifyContent='space-between' alignItems='center'>
                    <Text color='white' fontWeight='bold' fontSize='xl'>
                        +
                    </Text>
                    <Text color='white'>
                        {text.createNewGroup}
                    </Text>
                </HStack>
            </CustomButton>


            <Modal   _backdrop={{
                bg: "coolGray.900", // backdrop color
                opacity: 0.6,       // makes it see-through

            }}
                     isOpen={isModalVisible}
                     onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.Body>
                        <Box>
                            {text.createNewGroup}
                        </Box>


                        <CustomButton isLoading={isSaving} onPress={() => handleCreateNewGroup}>
                            {useText('createNewGroup')}
                        </CustomButton>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}