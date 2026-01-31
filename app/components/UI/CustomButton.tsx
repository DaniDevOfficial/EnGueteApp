import React, { ReactNode } from 'react'
import { Button, IButtonProps } from 'native-base'

interface CustomButtonProps extends IButtonProps {
    children: ReactNode
    onlyOutline?: boolean
    onPress?: () => void
}

export function CustomButton ({ children, onPress, onlyOutline = false, ...props }: CustomButtonProps) {

    if (onlyOutline) {
        return (
            <Button
                borderRadius={30}
                borderColor={"orange.600"}
                backgroundColor={"white"}
                borderWidth={1}
                onPress={onPress}
                _pressed={{ opacity: 0.6 }}
                {...props}
                shadow={1}
            >
                {children}
            </Button>
        )
    }

    return (
        <Button
            borderRadius={30}
            background={"orange.600"}
            onPress={onPress}
            _pressed={{ opacity: 0.6 }}
            {...props}
            shadow={5}
        >
            {children}
        </Button>
    );

}
