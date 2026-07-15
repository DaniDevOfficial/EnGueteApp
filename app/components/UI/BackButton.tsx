import React from 'react';
import {Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BackButtonProps = {
    color?: string;
};

export function BackButton({color = 'black'}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.goBack()}
            className="absolute left-[15px] top-[30px] z-10"
            hitSlop={8}
        >
            <View className="rounded-full bg-gray-300 p-1">
                <Ionicons name="arrow-back" size={24} color={color}/>
            </View>
        </Pressable>
    );
}
