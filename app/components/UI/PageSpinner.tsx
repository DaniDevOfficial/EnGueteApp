import {Box, Spinner} from "native-base";
import React from "react";

export function PageSpinner(){
    return (
        <Box flex={1} alignItems="center" justifyContent="center">
            <Spinner size="lg" color="orange.500"/>
        </Box>
    )
}