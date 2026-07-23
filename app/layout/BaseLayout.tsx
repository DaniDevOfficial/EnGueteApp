import React, {ReactNode} from 'react';
import {StatusBar, View} from 'react-native';
import {colors} from '../theme/colors';

export function BaseLayout({children, noPadding = false}: { children: ReactNode, noPadding?: boolean }) {
    return (
        <View className={noPadding ? 'flex-1 bg-surface' : 'flex-1 bg-surface px-4 pt-[50px]'}>
            <StatusBar
                backgroundColor={colors.surface.DEFAULT}
                barStyle="dark-content"
            />
            {children}
        </View>
    );
}
