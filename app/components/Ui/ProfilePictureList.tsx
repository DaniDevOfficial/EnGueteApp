import React from "react";
import {Image, Text, View} from "react-native";

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

    return (
        <View className="flex-row items-center">
            {visiblePictures.map((pic, index) => (
                <View
                    key={index}
                    className={`h-[45px] w-[45px] items-center justify-center overflow-hidden rounded-full border-2 border-white ${index === 0 ? '' : '-ml-[5px]'}`}
                >
                    <Image
                        source={{uri: pic}}
                        accessibilityLabel={`profile-${index}`}
                        className="h-full w-full rounded-full"
                    />
                </View>
            ))}

            {remaining > 0 && (
                <View
                    className="-ml-[5px] h-[45px] w-[45px] items-center justify-center rounded-full border-2 border-white bg-gray-400"
                >
                    <Text className="text-sm font-bold leading-5 text-white">
                        +{remaining}
                    </Text>
                </View>
            )}
        </View>
    )
}
