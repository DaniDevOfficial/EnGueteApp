import React, {useState} from 'react';
import {Button, FormControl, Input, VStack} from "native-base";
import {StackActions, useNavigation} from "@react-navigation/native";
import {BackButton} from "../components/UI/BackButton";
import {CreateNewGroup, NewGroupType} from "../repo/Group";
import {useTexts} from "../utility/TextKeys/TextKeys";


export function NewGroup() {
    const [title, setTitle] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);


    const navigation = useNavigation();
    const text = useTexts(['createNewGroup', 'groupName', 'enterANameForTheGroup'])
    async function handleSubmit() {
        setLoading(true);
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
            return;
        } catch (e) {
            console.log(e.message());
        }
        setLoading(false);

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
                        placeholder={text.enterANameForTheGroup}
                    />
                </FormControl>

                <Button onPress={handleSubmit} isDisabled={!title} isLoading={loading}>
                    {text.createNewGroup}
                </Button>
            </VStack>
        </>

    );
}
