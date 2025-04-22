import {Box, Flex, HStack, Text} from "native-base";
import React from "react";

interface PageTitleSectionProps {
    title: string;
    color?: string;
}

export function PageTitleSection({title, color = "black"}: PageTitleSectionProps) {
    return (

        <Flex alignItems={"center"}>
            <HStack alignItems="center" space={4} width="90%">
                <Box flex={1} height="1px" bg={color} width="10px"/>
                <Text textAlign="center" color={color} fontWeight="bold" fontSize="xl">
                    {title}
                </Text>
                <Box flex={1} height="1px" bg={color}/>
            </HStack>
        </Flex>
    );
}
