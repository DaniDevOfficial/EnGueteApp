import React, {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {Easing, FadeInDown, FadeOutUp, LinearTransition,} from "react-native-reanimated";
import {colors} from "../../theme/colors";

export type ToastStatus = "info" | "success" | "warning" | "error";
export type ToastVariant = "left-accent" | "top-accent" | "solid" | "subtle" | "outline";

export interface ShowToastParams {
    title: string;
    description: string;
    status?: ToastStatus;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastItem extends ShowToastParams {
    id: string;
}

const DEFAULT_DURATION = 4000;
const ENTER_MS = 320;
const EXIT_MS = 240;

const STATUS_STYLES: Record<
    ToastStatus,
    { icon: string; accent: string; bg: string; solidBg: string }
> = {
    error: {
        icon: "alert-circle",
        accent: colors.status.error,
        bg: colors.status.errorSoft,
        solidBg: colors.status.error,
    },
    warning: {
        icon: "warning",
        accent: colors.status.warning,
        bg: colors.status.warningSoft,
        solidBg: colors.status.warning,
    },
    success: {
        icon: "checkmark-circle",
        accent: colors.status.success,
        bg: colors.status.successSoft,
        solidBg: colors.status.success,
    },
    info: {
        icon: "information-circle",
        accent: colors.status.info,
        bg: colors.status.infoSoft,
        solidBg: colors.status.info,
    },
};

let showToastHandler: ((params: ShowToastParams) => void) | null = null;

/**
 * Show a toast. Works from any screen once ToastProvider is mounted.
 *
 * @example
 * showToast({
 *   title: 'Success!',
 *   description: 'Everything went fine',
 *   status: 'success',
 * })
 */
export function showToast(params: ShowToastParams) {
    if (!showToastHandler) {
        console.warn("ToastProvider is not mounted — toast was not shown.");
        return;
    }
    showToastHandler(params);
}

export function ToastProvider({children}: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const insets = useSafeAreaInsets();

    const hideToast = useCallback((id: string) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const presentToast = useCallback((params: ShowToastParams) => {
        const id = `${params.title}${params.description}`;

        setToasts((current) => {
            if (current.some((toast) => toast.id === id)) {
                return current;
            }
            return [...current, {...params, id}];
        });

        if (!timersRef.current.has(id)) {
            const timer = setTimeout(() => {
                hideToast(id);
            }, params.duration ?? DEFAULT_DURATION);
            timersRef.current.set(id, timer);
        }
    }, [hideToast]);

    useEffect(() => {
        showToastHandler = presentToast;
        return () => {
            showToastHandler = null;
            timersRef.current.forEach(clearTimeout);
            timersRef.current.clear();
        };
    }, [presentToast]);

    return (
        <>
            {children}
            <View
                pointerEvents="box-none"
                className="absolute left-0 right-0 top-0 z-[9999] items-center px-4"
                style={{paddingTop: Math.max(insets.top, 12) + 8}}
            >
                {toasts.map((toast) => (
                    <ToastAlert
                        key={toast.id}
                        {...toast}
                        onClose={() => hideToast(toast.id)}
                    />
                ))}
            </View>
        </>
    );
}

function ToastAlert({
                        title,
                        description,
                        status = "info",
                        variant = "left-accent",
                        onClose,
                    }: ToastItem & { onClose: () => void }) {
    const style = STATUS_STYLES[status];
    const isSolid = variant === "solid";
    const isOutline = variant === "outline";
    const textColor = isSolid ? "text-white" : "text-ink";
    const iconColor = isSolid ? colors.surface.DEFAULT : style.accent;

    const backgroundColor = isSolid
        ? style.solidBg
        : isOutline
            ? colors.surface.DEFAULT
            : style.bg;

    const accentBorderStyle =
        variant === "left-accent"
            ? {borderLeftWidth: 4, borderLeftColor: style.accent}
            : variant === "top-accent"
                ? {borderTopWidth: 4, borderTopColor: style.accent}
                : undefined;

    return (
        <Animated.View
            entering={FadeInDown.duration(ENTER_MS).easing(Easing.out(Easing.cubic))}
            exiting={FadeOutUp.duration(EXIT_MS).easing(Easing.in(Easing.cubic))}
            layout={LinearTransition.duration(220).easing(Easing.out(Easing.cubic))}
            style={{width: "90%", marginBottom: 8}}
        >
            <Pressable
                className={`overflow-hidden rounded-md ${isOutline ? "border border-gray-300" : ""}`}
                style={[{backgroundColor}, accentBorderStyle]}
                onPress={onClose}
                accessibilityRole="alert"
                accessibilityLabel={`${title}. ${description}`}
            >
                <View className="w-full gap-1 p-3">
                    <View className="flex-row items-center justify-between">
                        <View className="mr-2 flex-1 flex-row items-center gap-2">
                            <Ionicons name={style.icon as any} size={20} color={iconColor}/>
                            <Text className={`flex-shrink text-base font-medium ${textColor}`}>
                                {title}
                            </Text>
                        </View>
                        <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Dismiss">
                            <Ionicons
                                name="close"
                                size={18}
                                color={isSolid ? colors.surface.DEFAULT : colors.ink.soft}
                            />
                        </Pressable>
                    </View>
                    <Text className={`pl-7 text-sm ${textColor}`}>
                        {description}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}
