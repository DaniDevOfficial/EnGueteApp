import React, {ReactNode} from 'react';
import {Box} from 'native-base';

export function BaseLayout({children, noPadding = false}: { children: ReactNode, noPadding?: boolean }) {
    return (
        <Box flex={1} pt={noPadding ? 0 : 50} px={noPadding ? 0 : 4} bg="gray.100">
            {children}
        </Box>
    );
}
