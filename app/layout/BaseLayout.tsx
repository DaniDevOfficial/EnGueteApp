import React, {ReactNode} from 'react';
import {StatusBar, View} from 'react-native';

export function BaseLayout({children, noPadding = false}: { children: ReactNode, noPadding?: boolean }) {
    return (
        <View className={noPadding ? 'flex-1 bg-[#f4f4f5]' : 'flex-1 bg-[#f4f4f5] px-4 pt-[50px]'}>
            <StatusBar
                backgroundColor="#8D8D8D40"
                barStyle="dark-content"
            />
            {children}
        </View>
    );
}
