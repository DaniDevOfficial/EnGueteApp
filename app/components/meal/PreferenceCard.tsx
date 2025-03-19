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
                    alignItems={'center'}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Flex
                        w='40%'
                        overflow={'hidden'}
                        flexDir={'column'}
                    >
                        <Text>
                            {mealParticipants.username}
                        </Text>
                    </Flex>
                    <Flex>
                        <Flex flexDir={'row'} alignItems={'center'}>
                            <PillTag text={mealParticipants.preference}/>
                            {mealParticipants.isCook && (
                                <PillTag text={'👨‍🍳'}/>
                            )}
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

