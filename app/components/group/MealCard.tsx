import React from 'react';
import {Box, Flex, HStack, Icon, Pressable, Text} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getFancyTimeDisplay, getTime, semiNormalDateTime} from "../../utility/Dates";
import {getParticipantsText} from "../../utility/TextGeneration";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText} from "../../utility/TextKeys/TextKeys";
import {MaterialIcons} from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('meal', {mealId: meal.mealId});
    }

    const whenText = getTime(meal.dateTime)
    const participantsText = getParticipantsText(meal.participantCount)
    return (
        <Pressable onPress={handleNavigate} alignItems={'center'} width={'100%'}>
            <Box alignItems="center" p="4" borderRadius="md" shadow={'5'} backgroundColor={meal.closed ? 'coolGray.200' : 'white'} width={'95%'} my={2} position={'relative'}>
                {meal.fulfilled && (
                    <Box position="absolute" top={-11} right={-10}>
                        <Icon
                            as={MaterialIcons}
                            name="check-circle"
                            size="lg"
                            color="green.500"
                        />
                    </Box>
                )}

                <Flex
                    justifyContent={"space-between"}
                    flexDir={'row'}
                    width={"100%"}
                >
                    <Flex
                        w='50%'
                        flexDir={'column'}
                    >
                        <Text isTruncated>
                            {meal.title}
                        </Text>
                        <HStack space={1}>
                            <Ionicons name={'time-outline'} size={20}/>

                            <Text isTruncated>{whenText}</Text>
                        </HStack>
                    </Flex>
                    <Flex alignItems={'flex-end'} w={'50%'}>

                        <Text isTruncated>
                            {participantsText}
                        </Text>
                        <Flex flexDir={'row'}>
                            {meal.isCook && <PillTag text={'‍👨‍🍳'}/>}
                            <PillTag text={mealPreferenceText(meal.userPreference)} colorScheme={'orange'}/>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Pressable>
    );
}
