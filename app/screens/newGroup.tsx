import React, {useState} from 'react';
import {Button, FormControl, Input, VStack} from "native-base";
import {StackActions, useNavigation} from "@react-navigation/native";
import {BackButton} from "../components/UI/BackButton";
import {CreateNewGroup, NewGroupType} from "../repo/Group";
import {useTexts} from "../utility/TextKeys/TextKeys";


export function NewGroup() {
    const [title, setTitle] = useState<string | undefined>();
    const navigation = useNavigation();
    const text = useTexts(['createNewGroup', 'groupName'])
    async function handleSubmit() {
        try {
            const data: NewGroupType = {
                // @ts-ignore
                groupName: title,
            }
            const res = await CreateNewGroup(data)

            // @ts-ignore
            navigation.dispatch(
                StackActions.replace('group', {
                    screen: 'groupDetails',
                    params: {
                        groupId: res.groupId,
                    },
                })
            );
        } catch (e) {
            console.log(e.message());
        }

    }


    return (
        <>
            <BackButton/>
            <VStack space={4} padding={4}>

                <FormControl>
                    <FormControl.Label>{text.groupName}</FormControl.Label>
                    <Input
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                        p={3}
                        placeholder="Enter a title for the Group"
                    />
                </FormControl>

                <Button onPress={handleSubmit} isDisabled={!title}>
                    {text.createNewGroup}
                </Button>
            </VStack>
        </>

    );
}
