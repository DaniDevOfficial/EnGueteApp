import React, {ReactNode} from "react";
import {Text, TouchableOpacity, TouchableOpacityProps} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
    children: ReactNode;
    onlyOutline?: boolean;
}

export function CustomButton({
                                 children,
                                 onlyOutline = false,
                                 style,
                                 ...props
                             }: CustomButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            className={
                onlyOutline
                    ? "rounded-full border border-orange-600 bg-white shadow px-5 py-3 items-center justify-center"
                    : "rounded-full bg-orange-600 shadow-lg px-5 py-3 items-center justify-center"
            }
            style={style}
            {...props}
        >
            {typeof children === "string" ? (
                <Text
                    className={
                        onlyOutline
                            ? "text-orange-600 font-semibold"
                            : "text-white font-semibold"
                    }
                >
                    {children}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}