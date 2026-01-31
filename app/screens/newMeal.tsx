import React, {useEffect, useState} from 'react';
import {
    Button,
    FormControl,
    Icon,
    Image,
    Input,
    TextArea,
    useToast,
    VStack,
    WarningOutlineIcon,
    Text
} from "native-base";
import {createNewMeal} from "../repo/Meal";
import {StackActions, useNavigation} from "@react-navigation/native";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {getSwissDateTimeDisplay} from "../utility/Dates";
import Ionicons from "react-native-vector-icons/Ionicons";
import {BackButton} from "../components/UI/BackButton";
import {showDatePicker} from "../components/Utility/DatePicker";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {showToast} from "../components/UI/Toast";
import {handleLogoutProcedure} from "../Util";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import {CustomButton} from "../components/UI/CustomButton";
import newMealIcon from "../assets/PopupIcons/newMealIcon.png";

export interface NewMealType {
    title: string,
    type: string,
    scheduledAt: string,
    notes?: string,
}

export function NewMeal() {

    const {group} = useGroup()
    const groupId = group.groupId;
    const navigation = useNavigation();
    const text = useTexts(['mealName', 'mealNamePlaceholder', 'mealType', 'mealTypePlaceholder', 'scheduledAt', 'scheduledAtPlaceholder', 'mealDescription', 'mealDescriptionPlaceholder', 'createNewMeal', 'createMeal', 'isRequired', 'error', 'youAreNotAllowedToPerformThisAction']);
    const toast = useToast();

    const [title, setTitle] = useState<string | undefined>();
    const [type, setType] = useState<string | undefined>();
    const [scheduledAt, setScheduledAt] = useState<string | undefined>();
    const [scheduledAtDate, setScheduledAtDate] = useState<Date>(new Date());
    const [notes, setNotes] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

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
        const titleError = !title?.trim() ? text.mealName + ' ' + text.isRequired : "";
        const scheduledAtError = !scheduledAt?.trim() ? text.scheduledAt + ' ' + text.isRequired : "";
        const typeError = !type?.trim() ? text.scheduledAt + ' ' + text.isRequired : "";

        setErrors({
            title: touched.title ? titleError : "",
            scheduledAt: touched.scheduledAt ? scheduledAtError : "",
            type: touched.type ? typeError : ''
        });

        setIsDisabledSubmit(Boolean(titleError || scheduledAtError));
    }, [title, scheduledAt, touched]);

    async function handleSubmit() {
        if (isDisabledSubmit) return;
        setLoading(true);
        try {
            const data: NewMealType = {
                // @ts-ignore
                title: title,
                // @ts-ignore
                type: type,
                // @ts-ignore
                scheduledAt: scheduledAtDate.toISOString(),
                notes: notes,
                groupId: groupId
            }
            const res = await createNewMeal(data)

            // @ts-ignore
            navigation.dispatch(
                StackActions.replace('meal', {
                    mealId: res.mealId,
                })
            );
            return;
        } catch (e) {
            showToast({
                toast,
                title: text.error,
                description: text.youAreNotAllowedToPerformThisAction,
                status: "warning",
            })
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
            if (e instanceof ForbiddenError) {
                navigation.goBack();
            }

        }
        setLoading(true);
        setTouched({type: false, title: false, scheduledAt: false});
    }

    useEffect(() => {
        if (!group.userRoleRights || !group.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL)) {
            showToast({
                toast,
                title: text.error,
                description: text.youAreNotAllowedToPerformThisAction,
                status: "warning",
            })
            navigation.goBack();
        }
    }, []);

    function onChangeDatePicker(event: any, selectedDate?: Date) {
        if (!selectedDate) return;

        setScheduledAtDate(selectedDate);
        const text = getSwissDateTimeDisplay(selectedDate);
        setScheduledAt(text);
    }

    function showDatepickerSequencing() {
        setTouched({...touched, scheduledAt: true});
        showDatePicker("date", (event: any, selectedDate: any) => {
            if (selectedDate) {
                onChangeDatePicker(event, selectedDate);
                showDatePicker("time", onChangeDatePicker, selectedDate);
            }
        }, scheduledAtDate);
    }

    return (
        <>
            <BackButton/>
            <VStack space={4} padding={4} alignItems={'center'} width={'100%'}>


                <Image
                    source={newMealIcon}
                    alt="Profile picture"
                    width="200px"
                    height="200px"
                />
                <Text
                    fontSize={'2xl'}
                    fontWeight={'bold'}
                >
                    {text.createMeal}
                </Text>

                <FormControl isRequired isInvalid={Boolean(errors.title)}>
                    <FormControl.Label>{text.mealName}</FormControl.Label>
                    <Input
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                        onBlur={() => setTouched((prev) => ({...prev, title: true}))}
                        p={3}
                        placeholder={text.mealNamePlaceholder}
                    />
                    {errors.title ? (
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.title}</FormControl.ErrorMessage>
                    ) : null}
                </FormControl>
                <FormControl isRequired isInvalid={errors.type !== ''}>
                    <FormControl.Label>{text.mealType}</FormControl.Label>
                    <Input
                        value={type}
                        onChangeText={setType}
                        p={3}
                        placeholder={text.mealTypePlaceholder}
                    />
                    {errors.type ? (
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.type}</FormControl.ErrorMessage>
                    ) : null}
                </FormControl>
                <FormControl isRequired isInvalid={Boolean(errors.scheduledAt)}>
                    <FormControl.Label>{text.scheduledAt}</FormControl.Label>
                    <Input
                        value={scheduledAt /*TODO DatePicker */}
                        isReadOnly={true}
                        p={3}
                        placeholder={text.scheduledAtPlaceholder}
                        InputRightElement={
                            <Button
                                backgroundColor="green.800"
                                onPress={() => {
                                    showDatepickerSequencing()
                                }} size="xs" p={3}>
                                <Icon as={Ionicons} name="calendar" size={5} color={`white`}/>
                            </Button>
                        }
                    />
                    {errors.scheduledAt ? (
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs"/>}>{errors.scheduledAt}</FormControl.ErrorMessage>
                    ) : null}
                </FormControl>
                <FormControl>
                    <FormControl.Label>{text.mealDescription}</FormControl.Label>
                    <TextArea
                        value={notes}
                        onChangeText={setNotes}
                        placeholder={text.mealDescriptionPlaceholder}
                        tvParallaxProperties={undefined}
                        onTextInput={undefined}
                        autoCompleteType={undefined}/>
                </FormControl>
                <CustomButton width={'100%'} onPress={handleSubmit} isDisabled={isDisabledSubmit} isLoading={loading}>
                    {text.createNewMeal}
                </CustomButton>
            </VStack>
        </>

    );
}
