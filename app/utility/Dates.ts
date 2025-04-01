export function getFancyTimeDisplay(dateTimeString: string): string {
    const now = new Date();
    const target = new Date(dateTimeString);

    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffMs = target.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (nowDate.getTime() === targetDate.getTime()) {
        if (diffMinutes === 0) {
            return 'Now'
        }
        if (diffMinutes > 0 && diffMinutes < 60) {
            return `In ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
        } else if (diffMinutes < 0 && diffMinutes > -60) {
            return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? "s" : ""} ago`;
        } else {
            return `Today at ${target.toLocaleTimeString([], options)}`;
        }
    }

    if (diffDays === -1) {
        return `Yesterday at ${target.toLocaleTimeString([], options)}`;
    }

    if (diffDays === 1) {
        return `Tomorrow at ${target.toLocaleTimeString([], options)}`;
    }

    if (diffDays < -1 && diffDays >= -7) {
        return `Last ${dayNames[target.getDay()]}`;
    }

    if (diffDays > 1 && diffDays <= 7) {
        return `This ${dayNames[target.getDay()]} at ${target.toLocaleTimeString([], options)}`;
    }

    return `On ${target.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })}`;
}

export function toNormalDateTime(dateTimeString: string) {
    const target = new Date(dateTimeString);

    return `On ${target.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })}`
}

export function getSwissDateTimeDisplay(dateTime: Date) {
    const date = dateTime.toLocaleDateString("de-CH");
    const time = dateTime.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", hour12: false });

    return `${date} ${time}`;
}