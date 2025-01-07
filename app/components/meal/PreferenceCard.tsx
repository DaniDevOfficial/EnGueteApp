import React from 'react';
import {MealParticipants} from "../../repo/Meal";
import {Box, Flex, Pressable, Text} from "native-base";
import {PillTag} from "../UI/Pilltag";
import {useGroup} from "../../context/groupContext";
import {PERMISSIONS} from "../../utility/Roles";

export function PreferenceCard({mealParticipants}: { mealParticipants: MealParticipants }) {
    function handlePress() {

    }
    const {group} = useGroup();

    return (
        <Pressable onPress={handlePress} alignItems={'center'}>
            <Box alignItems="center" p="4" borderRadius="md" backgroundColor={"coolGray.300"} width={'95%'} my={2}>
                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Flex
                        w='60%'
                        flexDir={'column'}
                    >
                        <Text>
                            {mealParticipants.username}
                        </Text>
                    </Flex>
                    <Flex>
                        <Flex alignItems={'flex-end'}>
                            {mealParticipants.isCook && (
                                <PillTag text={'👨‍🍳'}/>
                            )}
                            <Text>{mealParticipants.preference}</Text>
                        </Flex>

                    </Flex>
                    {group.userRoleRights && group.userRoleRights.includes(PERMISSIONS.CAN_CHANGE_FORCE_MEAL_PREFERENCE_AND_COOKING) && (
                        <>

                        </>
                    )}
                </Flex>
            </Box>
        </Pressable>
    );
}

