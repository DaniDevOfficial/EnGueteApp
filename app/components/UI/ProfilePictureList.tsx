import {Box, HStack, Image, Text} from "native-base";
import React from "react";

export function ProfilePictureList({
                                       profilePictures,
                                       totalAmount = null
                                   }: { profilePictures: string[], totalAmount: number | null }) {

    const visiblePictures = profilePictures.slice(0, 3)
    const remaining = totalAmount
            ? totalAmount - visiblePictures.length
            : profilePictures.length > 3
                ? profilePictures.length - 3
                : 0


    const overlap = -5
    const radius = '45px';
    return (
        <HStack>
            {visiblePictures.map((pic, index) => (
                <Box
                    key={index}
                    ml={index === 0 ? 0 : overlap}
                    borderWidth={2}
                    borderColor="white"
                    borderRadius="full"
                    overflow="hidden"
                    alignItems="center"
                    justifyContent="center"
                    w={radius}
                    h={radius}
                >
                    <Image
                        source={{ uri: pic }}
                        alt={`profile-${index}`}
                        w={'100%'}
                        height={'100%'}
                        borderRadius="full"
                    />
                </Box>
            ))}

            {remaining > 0 && (
                <Box
                    key={remaining}
                    w={radius}
                    h={radius}
                    ml={overlap}
                    borderWidth={2}
                    borderColor="white"
                    borderRadius="full"
                    bg="gray.400"
                    alignItems="center"
                    justifyContent="center"
                >

                    <Text color="white" fontSize="sm" fontWeight="bold" lineHeight={20}

                    >
                        +{remaining}
                    </Text>
                </Box>
            )}
        </HStack>
    )
}