import React from 'react';
import {Box, Text} from 'native-base';

type PillProps = {
    text: string;
    colorScheme?: string;
};

export function PillTag({text, colorScheme = 'black'}: PillProps) {
    return (
        <Box
            px="2"
            py="0.5"
            borderRadius="full"
            borderColor={`${colorScheme}.500`}
            background={`${colorScheme}.100`}
            borderWidth={'1px'}
            mx="1"
        >
            <Text isTruncated>
                {text}
            </Text>
        </Box>
    );
}
