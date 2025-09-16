import React, { ReactNode } from 'react'
import { Button, IButtonProps } from 'native-base'

interface CustomButtonProps extends IButtonProps {
    children: ReactNode
    onPress?: () => void
}

export function CustomButton ({ children, onPress, ...props }: CustomButtonProps) {
    return (
        <Button
            borderRadius={30}
            background={"orange.600"}
            onPress={onPress}
            {...props}
            shadow={5}
        >
            {children}
        </Button>
    )
}
