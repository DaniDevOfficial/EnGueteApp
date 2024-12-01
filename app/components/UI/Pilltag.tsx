import React from 'react';
import {Box, Text} from 'native-base';

type PillProps = {
    text: string;
    colorScheme?: string;
};

export function PillTag({text, colorScheme = 'black'}: PillProps) {
    return (
        <Box
            px="3"
            py="1"
            borderRadius="full"
            borderColor={`${colorScheme}.500`}
            borderWidth={'1px'}
            mx="1"
        >
            <Text>
                {text}
            </Text>
        </Box>
    );
}
