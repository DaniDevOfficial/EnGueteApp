import {Box, Heading} from "native-base";
import React from "react";

export function Title({ title, color }: { title?: string, color?: string }): React.JSX.Element {
    return (
        <Box
            style={{
                position: 'absolute',
                top: 30,
                left: 0,
                right: 0,
                zIndex: 1,
                alignItems: 'center',
            }}
            color={color ?? 'black'}
        >
            <Heading isTruncated maxW={'70%'}>
                {title}
            </Heading>
        </Box>
    )
}
