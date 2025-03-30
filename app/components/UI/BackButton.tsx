import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';


type BackButtonProps = {
    color?: string;
};


export function BackButton({color = 'black'}: BackButtonProps) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                position: 'absolute',
                top: 30,
                left: 15,
                zIndex: 10,
            }}
        >
            <Icon as={Ionicons} name="arrow-back" size={6} color={`${color ?? 'black'}`} />
        </TouchableOpacity>
    );
}
