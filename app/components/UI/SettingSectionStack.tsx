import {Box, HStack, Icon, Pressable, Text, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export interface Option {
    label: string;
    icon: string;
    onPress: () => void;
    iconColor?: string;
    textColor?: string;
}

export function SettingsSectionStack({options, title}: { options: Option[], title: string }) {

    return (
        <VStack space={2}>
            <Box>
                <Text fontWeight="bold" fontSize="xl">{title}</Text>
            </Box>
            <VStack
                borderColor="coolGray.300"
                borderWidth={1}
                borderRadius="md"
                px={2}
            >
                {options.map((option, index) => (
                    <Pressable key={index} onPress={option.onPress}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack
                                alignItems="center"
                                space={2}
                                p={2}
                                borderRadius="md"
                                bg="coolGray.100"
                            >
                                <Icon
                                    color={option.iconColor || 'coolGray.500'}
                                    size={6}
                                    as={Ionicons}
                                    name={option.icon}
                                />
                                <Text
                                    color={option.textColor || 'coolGray.800'}
                                    fontWeight="medium"
                                >
                                    {option.label}
                                </Text>
                            </HStack>
                            <Icon
                                as={Ionicons}
                                name="chevron-forward-outline"
                                size={5}
                            />
                        </HStack>
                        {index < options.length - 1 && (
                            <Box height="1px" bg="coolGray.200" mx={2} my={1}/>
                        )}
                    </Pressable>
                ))}
            </VStack>
        </VStack>
    )
}