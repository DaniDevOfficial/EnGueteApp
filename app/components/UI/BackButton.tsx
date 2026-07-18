import React from 'react';
import {Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';

type BackButtonProps = {
    color?: string;
};

export function BackButton({color = colors.ink.DEFAULT}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-7 z-10 h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-surface shadow-sm"
            hitSlop={12}
        >
            <Ionicons
                name="chevron-back"
                size={22}
                color={color}
            />
        </Pressable>
    );
}
