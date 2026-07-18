import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {createNewMeal} from "../repo/Meal";
import {StackActions, useNavigation} from "@react-navigation/native";
import {useGroup} from "../context/groupContext";
import {PERMISSIONS} from "../utility/Roles";
import {getSwissDateTimeDisplay} from "../utility/Dates";
import Ionicons from "react-native-vector-icons/Ionicons";
import {BackButton} from "../components/Ui/BackButton";
import {showDatePicker} from "../components/Utility/DatePicker";
import {useTexts} from "../utility/TextKeys/TextKeys";
import {showToast} from "../components/Ui/Toast";
import {handleLogoutProcedure} from "../Util";
import {ForbiddenError, UnauthorizedError} from "../utility/Errors";
import newMealIcon from "../assets/PopupIcons/newMealIcon.png";
import {colors} from '../theme/colors';

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
        setLoading(false);
        setTouched({type: false, title: false, scheduledAt: false});
    }

    useEffect(() => {
        if (!group.userRoleRights || !group.userRoleRights.includes(PERMISSIONS.CAN_CREATE_MEAL)) {
            showToast({
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
        const display = getSwissDateTimeDisplay(selectedDate);
        setScheduledAt(display);
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
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <BackButton/>
                <View className="w-full items-center gap-4 p-4">
                    <Image
                        source={newMealIcon}
                        accessibilityLabel="new meal icon"
                        className="h-[200px] w-[200px]"
                        resizeMode="contain"
                    />
                    <Text className="text-2xl font-bold text-black">
                        {text.createMeal}
                    </Text>

                    <View className="w-full gap-1">
                        <Text className="text-sm font-medium text-gray-700">
                            {text.mealName} *
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            onBlur={() => setTouched((prev) => ({...prev, title: true}))}
                            placeholder={text.mealNamePlaceholder}
                            className={`rounded-md border bg-white p-3 text-base text-black ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!!errors.title && (
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="warning-outline" size={14} color={colors.status.error}/>
                                <Text className="text-sm text-red-500">{errors.title}</Text>
                            </View>
                        )}
                    </View>

                    <View className="w-full gap-1">
                        <Text className="text-sm font-medium text-gray-700">
                            {text.mealType} *
                        </Text>
                        <TextInput
                            value={type}
                            onChangeText={setType}
                            onBlur={() => setTouched((prev) => ({...prev, type: true}))}
                            placeholder={text.mealTypePlaceholder}
                            className={`rounded-md border bg-white p-3 text-base text-black ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!!errors.type && (
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="warning-outline" size={14} color={colors.status.error}/>
                                <Text className="text-sm text-red-500">{errors.type}</Text>
                            </View>
                        )}
                    </View>

                    <View className="w-full gap-1">
                        <Text className="text-sm font-medium text-gray-700">
                            {text.scheduledAt} *
                        </Text>
                        <View
                            className={`flex-row items-center rounded-md border bg-white ${errors.scheduledAt ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <TextInput
                                value={scheduledAt}
                                editable={false}
                                placeholder={text.scheduledAtPlaceholder}
                                className="flex-1 p-3 text-base text-black"
                                pointerEvents="none"
                            />
                            <Pressable
                                className="m-1 items-center justify-center rounded-md border border-app-orange px-3 py-2 active:opacity-60"
                                onPress={showDatepickerSequencing}
                            >
                                <Ionicons name="calendar" size={20} color={colors.brand.orangeLight}/>
                            </Pressable>
                        </View>
                        {!!errors.scheduledAt && (
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="warning-outline" size={14} color={colors.status.error}/>
                                <Text className="text-sm text-red-500">{errors.scheduledAt}</Text>
                            </View>
                        )}
                    </View>

                    <View className="w-full gap-1">
                        <Text className="text-sm font-medium text-gray-700">
                            {text.mealDescription}
                        </Text>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder={text.mealDescriptionPlaceholder}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="min-h-[100px] rounded-md border border-gray-300 bg-white p-3 text-base text-black"
                        />
                    </View>

                    <Pressable
                        className={`w-full items-center rounded-[30px] py-3 ${isDisabledSubmit || loading ? 'bg-orange-300' : 'bg-app-orange active:opacity-60'}`}
                        onPress={handleSubmit}
                        disabled={isDisabledSubmit || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.surface.DEFAULT}/>
                        ) : (
                            <Text className="text-base font-medium text-white">
                                {text.createNewMeal}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
