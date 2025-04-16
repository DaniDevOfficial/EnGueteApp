import React from "react";
import {Box, Button, Text, useColorMode} from "native-base";
import {useText} from "../../utility/TextKeys/TextKeys";


export function ThemeSelector() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box flex={1} alignItems={'center'}>
            <Text mb={2} fontSize={'xl'}  fontWeight="bold" >
                {useText('theme')}
            </Text>
            <Button onPress={toggleColorMode}>
                {colorMode === 'light' ? 'Switch to Dark 🌙' : 'Switch to Light ☀️'}
            </Button>
        </Box>
    );
}