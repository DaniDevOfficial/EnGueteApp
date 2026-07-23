import React from 'react';
import {Text, View} from 'react-native';

type PillScheme = 'orange' | 'yellow' | 'black' | 'success' | 'closed' | 'info' | string;

type PillProps = {
    text: string;
    colorScheme?: PillScheme;
};

const SCHEME_CLASS: Record<string, string> = {
    orange: 'border-brand-orange-light bg-brand-orange-muted',
    yellow: 'border-brand-yellow bg-brand-yellow-muted',
    black: 'border-ink bg-surface-muted',
    success: 'border-status-success bg-status-success-soft',
    closed: 'border-status-closed bg-status-closed-soft',
    info: 'border-status-info bg-status-info-soft',
    green: 'border-status-success bg-status-success-soft',
    blueGray: 'border-status-closed bg-status-closed-soft',
};

export function PillTag({text, colorScheme = 'black'}: PillProps) {
    const schemeClass = SCHEME_CLASS[colorScheme] ?? SCHEME_CLASS.black;

    return (
        <View className={`mx-0.5 rounded-full border px-2.5 py-0.5 ${schemeClass}`}>
            <Text numberOfLines={1} className="text-xs font-medium text-ink">
                {text}
            </Text>
        </View>
    );
}
