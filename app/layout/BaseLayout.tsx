import React, {ReactNode} from 'react';
import {Box} from 'native-base';

export function BaseLayout({ children }: { children: ReactNode }) {
    return (
        <Box flex={1} pt={50} px={4} bg="gray.100">
            {children}
        </Box>
    );
}
