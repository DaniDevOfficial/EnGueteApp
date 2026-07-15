import React, {ReactNode} from 'react';
import {StatusBar, View} from 'react-native';

export function BaseLayout({children, noPadding = false}: { children: ReactNode, noPadding?: boolean }) {
    return (
        <View className={noPadding ? 'flex-1 bg-white' : 'flex-1 bg-white px-4 pt-[50px]'}>
            <StatusBar
                backgroundColor="#ffffff"
                barStyle="dark-content"
            />
            {children}
        </View>
    );
}
