import React, {ReactNode} from 'react';
import {Box, StatusBar} from 'native-base';

export function BaseLayout({children, noPadding = false}: { children: ReactNode, noPadding?: boolean }) {
    return (
        <Box flex={1} pt={noPadding ? 0 : 50} px={noPadding ? 0 : 4} bg="gray.100">
            <StatusBar
                backgroundColor="#8D8D8D40"
                barStyle="dark-content"
            />
            {children}
        </Box>
    );
}
