import React from 'react';
import { Box } from 'native-base';

export function BaseLayout({ children }) {
    return (
        <Box flex={1} pt={10} px={4} bg="gray.100">
            {children}
        </Box>
    );
}
