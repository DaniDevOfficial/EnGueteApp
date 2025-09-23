import React from 'react';
import {Box, Flex, HStack, Icon, Pressable, Text, VStack} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {MealCard as MealCardType} from "../../repo/Group";
import {getTime, shortDate} from "../../utility/Dates";
import {PillTag} from "../UI/Pilltag";
import {mealPreferenceText, useTexts} from "../../utility/TextKeys/TextKeys";
import {MaterialIcons} from "@expo/vector-icons";
import {ProfilePictureList} from "../UI/ProfilePictureList";

type MealCardProps = {
    meal: MealCardType;
};

export function MealCard({meal}: MealCardProps) {
    const navigation = useNavigation();

    function handleNavigate() {

        // @ts-ignore
        navigation.navigate('meal', {mealId: meal.mealId});
    }

    const images = [];

    for (let i = 0; i < meal.participantCount; i++) {
        images.push('https://i0.wp.com/picjumbo.com/wp-content/uploads/palm-tree-and-sky-in-early-evening-free-image.jpg?w=600&quality=80')
    }

    const textsForMeal = useTexts(['open', 'closed', 'finished'])

    const whenDate = shortDate(meal.dateTime);
    const whenTimeDisplay = getTime(meal.dateTime);
    return (
        <>

            <Pressable onPress={handleNavigate}>
                <Box alignItems="center" p="4" borderRadius="md" shadow={'5'}
                     backgroundColor={meal.closed ? 'coolGray.300' : 'coolGray.200'} width={'95%'} my={2}
                     position={'relative'}>
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
                    <HStack
                        justifyContent={"space-between"}
                        flexDir={'row'}
                        width={"100%"}
                        space={'4'}
                    >
                        <VStack
                            w='45%'
                            space={'5'}
                        >
                            <VStack>
                                <Text isTruncated fontSize={'xl'} fontWeight={'bold'}>

                                    {meal.title}
                                </Text>
                                <HStack space={2}>
                                    <Text isTruncated>{whenDate}</Text>
                                    <Text>{'|'}</Text>
                                    <Text isTruncated>{whenTimeDisplay}</Text>s
                                </HStack>
                            </VStack>
                            <Flex flexDir={'row'}>
                                {meal.isCook && <PillTag text={'‍👨‍🍳'}/>}
                                <PillTag text={mealPreferenceText(meal.userPreference)} colorScheme={'orange'}/>
                            </Flex>
                        </VStack>
                        <Flex alignItems={'flex-end'} justifyContent={'space-between'} w={'45%'}>

                            <PillTagBasedOnMealOpenAndFinished meal={meal} textKeys={textsForMeal}/>
                            <ProfilePictureList
                                profilePictures={images}
                                totalAmount={meal.participantCount}/>

                        </Flex>
                    </HStack>
                </Box>

            </Pressable>

        </>
    );
}


interface PillTagBasedOnMealOpenAndFinishedProps {
    meal: MealCardType
    textKeys: { closed: string; finished: string; open: string }
}

function PillTagBasedOnMealOpenAndFinished({meal, textKeys}: PillTagBasedOnMealOpenAndFinishedProps) {

    if (meal.closed) {
        return (<PillTag text={textKeys.closed} colorScheme={'blueGray'}/>)
    }

    if (meal.fulfilled) {
        return (
            <PillTag text={textKeys.finished} colorScheme={'orange'}/>
        )
    }

    return (
        <PillTag text={textKeys.open} colorScheme={'green'}/>
    )
}