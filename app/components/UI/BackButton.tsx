import React from 'react';
import {Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BackButtonProps = {
    color?: string;
};

export function BackButton({color = '#111827'}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-7 z-10 h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white"
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
