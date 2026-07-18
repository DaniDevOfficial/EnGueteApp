import React from 'react';
import {Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';

type EditButtonProps = {
    color?: string;
    navigateTo: string;
};

export function EditButton({color = colors.ink.DEFAULT, navigateTo}: EditButtonProps) {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.navigate(navigateTo)}
            className="absolute right-4 top-7 z-10 active:opacity-70"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Settings"
        >
            <View className="h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-surface shadow-sm">
                <Ionicons name="settings-outline" size={20} color={color}/>
            </View>
        </Pressable>
    );
}
