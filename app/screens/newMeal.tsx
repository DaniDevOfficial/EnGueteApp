import React, {useEffect, useState} from 'react';
import {Button, FormControl, Input, TextArea, VStack, WarningOutlineIcon} from "native-base";
import {createNewMeal} from "../repo/Meal";
import {getAuthToken} from "../Util";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useGroup} from "../context/groupContext";

export interface NewMealType {
    title: string,
    type: string,
    scheduledAt: string,
    notes?: string,
}

export function NewMeal() {
    const [title, setTitle] = useState<string | undefined>();
    const [type, setType] = useState<string | undefined>();
    const [scheduledAt, setScheduledAt] = useState<string | undefined>();
    const [notes, setNotes] = useState<string | undefined>();

    const {group} = useGroup()

    const groupId = group.groupId;
    const navigation = useNavigation();

    const [touched, setTouched] = useState({
        title: false,
        scheduledAt: false,
        type: false
    });

    const [errors, setErrors] = useState({
        title: '',
        scheduledAt: '',
        type: '',
    });

    const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

    useEffect(() => {
        const titleError = !title?.trim() ? "Meal name is required" : "";
        const scheduledAtError = !scheduledAt?.trim() ? "Scheduled time is required" : "";
        const typeError = !type?.trim() ? "Meal Type is required" : "";

        setErrors({
            title: touched.title ? titleError : "",
            scheduledAt: touched.scheduledAt ? scheduledAtError : "",
            type: touched.type ? typeError : ''
        });

        setIsDisabledSubmit(Boolean(titleError || scheduledAtError));
    }, [title, scheduledAt, touched]);

    async function handleSubmit() {
        if (isDisabledSubmit) return;

        console.log({
            title,
            type,
            scheduledAt,
            notes,
        });
        try {
            const data: NewMealType = {
                // @ts-ignore
                title: title,
                // @ts-ignore
                type: type,
                // @ts-ignore
                scheduledAt: new Date().toISOString(),
                notes: notes,
                groupId: groupId
            }
            console.log(data)
            const authToken = await getAuthToken()

            if (authToken === null) {
                navigation.navigate('home')
                return
            }
            const res = await createNewMeal(data, authToken)
            console.log(res)
        } catch (e) {
            console.log(e.message())
        }

        setTouched({title: false, scheduledAt: false});
    }

    return (
        <VStack space={4} padding={4}>
            <FormControl isRequired isInvalid={errors.title}>
                <FormControl.Label>Meal Name</FormControl.Label>
                <Input
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    onBlur={() => setTouched((prev) => ({...prev, title: true}))}
                    p={3}
                    placeholder="Enter a title for the meal"
                />
                {errors.title ? (
                    <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.title}</FormControl.ErrorMessage>
                ) : null}
            </FormControl>
            <FormControl isRequired isInvalid={errors.type !== ''}>
                <FormControl.Label>Meal Type</FormControl.Label>
                <Input
                    value={type}
                    onChangeText={setType}
                    p={3}
                    placeholder="Type of the meal"
                />
                {errors.type ? (
                    <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.type}</FormControl.ErrorMessage>
                ) : null}
            </FormControl>
            <FormControl isRequired isInvalid={errors.scheduledAt}>
                <FormControl.Label>Scheduled At</FormControl.Label>
                <Input
                    value={scheduledAt /*TODO DatePicker */}
                    onChangeText={(text) => setScheduledAt(text)}
                    onBlur={() => setTouched((prev) => ({...prev, scheduledAt: true}))}
                    p={3}
                    placeholder="When the meal will take place"
                />
                {errors.scheduledAt ? (
                    <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.scheduledAt}</FormControl.ErrorMessage>
                ) : null}
            </FormControl>
            <FormControl>
                <FormControl.Label>General Notes</FormControl.Label>
                <TextArea
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Notes like grocery list"
                />
            </FormControl>
            <Button onPress={handleSubmit} isDisabled={isDisabledSubmit}>
                Create New Meal
            </Button>
        </VStack>
    );
}
