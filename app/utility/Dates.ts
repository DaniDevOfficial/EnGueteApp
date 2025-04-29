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

        return useText('thisWeekdayAtTime', {'weekday': useText(dayNames[target.getDay()]), 'time': target.toLocaleTimeString([], options)});
    }
    const month = monthNames[target.getMonth()];
    const year = target.getFullYear();
    const thisYear = now.getFullYear();
    return `${useText('onMonthDayAtTime', {year: year === thisYear ? '' : year.toString() ,month: useText(month), day: target.getDate().toString(), time: target.toLocaleTimeString([], options)})}`;
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

    return `${useText('onMonthDayAtTime', {year: year === thisYear ? '' : year.toString(), month: useText(month), day: target.getDate().toString(), time: target.toLocaleTimeString([], options)})}`;
}

export function getSwissDateTimeDisplay(dateTime: Date) {
    const date = dateTime.toLocaleDateString("de-CH");
    const time = dateTime.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", hour12: false });

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
