import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type EditButtonProps = {
    color?: string;
    navigateTo: string;
};

export function EditButton({color = 'black', navigateTo}: EditButtonProps) {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.navigate(navigateTo)}
            className="absolute right-[15px] top-[30px] z-10"
            hitSlop={8}
        >
            <Ionicons name="settings-outline" size={24} color={color}/>
        </Pressable>
    );
}
