import React from 'react';
import {Text, View} from 'react-native';

type PillProps = {
    text: string;
    colorScheme?: 'orange' | 'yellow' | 'black' | string;
};

const SCHEME_STYLES: Record<string, { border: string; background: string }> = {
    orange: {border: '#f97316', background: '#ffedd5'},
    yellow: {border: '#eab308', background: '#fef9c3'},
    black: {border: '#000000', background: '#f3f4f6'},
};

export function PillTag({text, colorScheme = 'black'}: PillProps) {
    const colors = SCHEME_STYLES[colorScheme] ?? SCHEME_STYLES.black;

    return (
        <View
            className="mx-1 rounded-full border px-2 py-0.5"
            style={{borderColor: colors.border, backgroundColor: colors.background}}
        >
            <Text numberOfLines={1} className="text-black">
                {text}
            </Text>
        </View>
    );
}
