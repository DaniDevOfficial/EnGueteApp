import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';


type BackButtonProps = {
    color?: string;
    navigateTo: string;
};


export function EditButton({color = 'black', navigateTo}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(navigateTo)}
            style={{
                position: 'absolute',
                top: 30,
                right: 15,
                zIndex: 10,
            }}
        >
            <Icon as={Ionicons} name="settings-outline" size={6} color={`${color ?? 'black'}`} />
        </TouchableOpacity>
    );
}
