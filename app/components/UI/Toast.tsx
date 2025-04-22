import React from "react";
import {Alert, CloseIcon, HStack, IconButton, Pressable, Text, useToast, VStack} from "native-base";

/**
 * 🥐 Show a toast message using the custom ToastAlert component
 *
 * Example usage:
 * ```tsx
 * showToast({
 *   toast,
 *   title: 'Success!',
 *   description: 'Everything went fine 🎉',
 *   status: 'success',
 * })
 * ```
 *
 * @param toast - The toast object from useToast()
 * @param title - Title of the toast
 * @param description - Message shown in the toast
 * @param status - Toast status (info | success | warning | error)
 * @param variant - Toast variant (left-accent | top-accent | solid | subtle | outline)
 */

export function showToast({
                              toast,
                              title,
                              description,
                              status = 'info',
                              variant = 'left-accent',
                          }: Omit<ToastParams, 'id'>) {
    const id = title + description

    if (toast.isActive(id)) return;

    toast.show({
        id,
        render: ({id}: {id: string}) => (
            <ToastAlert
                id={id}
                toast={toast}
                title={title}
                description={description}
                status={status}
                variant={variant}
            />
        ),
    });

}
type ToastType = ReturnType<typeof useToast>;


export interface ToastParams {
    id: string;
    toast: ToastType;
    status?: 'info' | 'success' | 'warning' | 'error';
    variant?: 'left-accent' | 'top-accent' | 'solid' | 'subtle' | 'outline';
    title: string;
    description: string;
}

function ToastAlert({
                        id,
                        toast,
                        status,
                        variant = 'left-accent',
                        title,
                        description,
                    }: ToastParams) {
    return (
        <Pressable onPress={() => toast.close(id)}>

            <Alert w="90%" alignSelf="center" flexDirection="row" status={status ? status : "info"}
                   variant={variant} borderRadius={'md'} >
                <VStack space={1} flexShrink={1} w="100%">
                    <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon/>
                            <Text fontSize="md" fontWeight="medium" flexShrink={1}
                                  color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                                {title}
                            </Text>
                        </HStack>
                        <IconButton variant="unstyled" icon={<CloseIcon size="3"/>} _icon={{
                            color: variant === "solid" ? "lightText" : "darkText"
                        }}/>
                    </HStack>
                    <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                        {description}
                    </Text>
                </VStack>
            </Alert>
        </Pressable>
    )
}