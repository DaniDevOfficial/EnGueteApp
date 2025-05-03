import {useText} from "./TextKeys/TextKeys";


const dayNames: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const monthNames: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"] = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];


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

        return `${useText('yesterdayAt')} ${target.toLocaleTimeString([], options)}`;
    }

    if (diffDays === 1) {
        return `${useText('tomorrowAt')} ${target.toLocaleTimeString([], options)}`;
    }

    if (diffDays < -1 && diffDays >= -7) {
        return `${useText('last')} ${useText(dayNames[target.getDay()])}`;
    }

    if (diffDays > 1 && diffDays <= 7) {

        return useText('thisWeekdayAtTime', {
            'weekday': useText(dayNames[target.getDay()]),
            'time': target.toLocaleTimeString([], options)
        });
    }
    const month = monthNames[target.getMonth()];
    const year = target.getFullYear();
    const thisYear = now.getFullYear();
    return `${useText('onMonthDayAtTime', {
        year: year === thisYear ? '' : year.toString(),
        month: useText(month),
        day: target.getDate().toString(),
        time: target.toLocaleTimeString([], options)
    })}`;
}

export function toNormalDateTime(dateTimeString: string) {
    const target = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    const month = monthNames[target.getMonth()];
    const now = new Date();

    const year = target.getFullYear();
    const thisYear = now.getFullYear();

    return `${useText('onMonthDayAtTime', {
        year: year === thisYear ? '' : year.toString(),
        month: useText(month),
        day: target.getDate().toString(),
        time: target.toLocaleTimeString([], options)
    })}`;
}

export function getSwissDateTimeDisplay(dateTime: Date) {
    const date = dateTime.toLocaleDateString("de-CH");
    const time = dateTime.toLocaleTimeString("de-CH", {hour: "2-digit", minute: "2-digit", hour12: false});

    return `${date} ${time}`;
}

export function getGreetingBasedOnTime(): 'morning' | 'day' | 'afternoon' | 'evening' {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 0 && hours < 7) {
        return 'morning';
    } else if (hours >= 7 && hours < 12) {
        return 'day';
    } else if (hours >= 12 && hours < 18) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

export function getWeekDuration(date: Date) {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const diffToSunday = day === 0 ? 0 : 7 - day;

    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    endOfWeek.setDate(endOfWeek.getDate() + diffToSunday);

    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        start: startOfWeek,
        end: endOfWeek
    }
}

export function getFancyWeekDisplay(date: Date) {
    const now = new Date();

    const thisWeek = getWeekDuration(now);
    const targetWeek = getWeekDuration(date);

    const start = thisWeek.start.getTime();
    const targetStart = targetWeek.start.getTime();

    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    if (targetStart === start) {
        return 'currentWeek';
    } else if (targetStart === start - oneWeekMs) {
        return 'lastWeek';
    } else if (targetStart === start + oneWeekMs) {
        return 'nextWeek';
    }

    return null;
}


export function getDateDurationWeek(date: Date) {
    const {start, end} = getWeekDuration(date);

    const startDate = start.toLocaleDateString("de-CH", {day: "2-digit", month: "2-digit", year: 'numeric'});
    const endDate = end.toLocaleDateString("de-CH", {day: "2-digit", month: "2-digit", year: 'numeric'});

    return `${startDate} - ${endDate}`;
}