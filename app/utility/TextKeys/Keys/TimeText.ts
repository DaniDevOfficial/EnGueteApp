export type TimeTextType =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
    | 'morning'

    | 'day'
    | 'afternoon'
    | 'evening'

    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'

    | 'now'
    | 'in'
    | 'minute'
    | 'minutes'
    | 'todayAt'
    | 'agoTimeUnit'
    | 'yesterdayAt'
    | 'tomorrowAt'
    | 'last'
    | 'thisWeekdayAtTime'
    | 'onMonthDayAtTime'
    ;

export type TimeTextKeyType = {
    [K in TimeTextType]: {
        german: string;
        english: string;
    };
};

export const TimeTextKey: TimeTextKeyType = {
    'monday': {
        german: 'Montag',
        english: 'Monday',
    },
    'tuesday': {
        german: 'Dienstag',
        english: 'Tuesday',
    },
    'wednesday': {
        german: 'Mittwoch',
        english: 'Wednesday',
    },
    'thursday': {
        german: 'Donnerstag',
        english: 'Thursday',
    },
    'friday': {
        german: 'Freitag',
        english: 'Friday',
    },
    'saturday': {
        german: 'Samstag',
        english: 'Saturday',
    },
    'sunday': {
        german: 'Sonntag',
        english: 'Sunday',
    },

    'morning': {
        german: 'Morgen',
        english: 'Morning',
    },
    'day': {
        german: 'Tag',
        english: 'Day',
    },
    'afternoon': {
        german: 'Nachmittag',
        english: 'Afternoon',
    },
    'evening': {
        german: 'Abend',
        english: 'Evening',
    },

    'january': {
        german: 'Januar',
        english: 'January',
    },
    'february': {
        german: 'Februar',
        english: 'February',
    },
    'march': {
        german: 'März',
        english: 'March',
    },
    'april': {
        german: 'April',
        english: 'April',
    },
    'may': {
        german: 'Mai',
        english: 'May',
    },
    'june': {
        german: 'Juni',
        english: 'June',
    },
    'july': {
        german: 'Juli',
        english: 'July',
    },
    'august': {
        german: 'August',
        english: 'August',
    },
    'september': {
        german: 'September',
        english: 'September',
    },
    'october': {
        german: 'Oktober',
        english: 'October',
    },
    'november': {
        german: 'November',
        english: 'November',
    },
    'december': {
        german: 'Dezember',
        english: 'December',
    },

    'now': {
        german: 'Jetzt',
        english: 'Now',
    },
    'in': {
        german: 'In',
        english: 'In',
    },
    'minute': {
        german: 'Minute',
        english: 'minute',
    },
    'minutes': {
        german: 'Minuten',
        english: 'minutes',
    },
    'todayAt': {
        german: 'Heute um',
        english: 'Today at',
    },
    'agoTimeUnit': {
        german: 'Vor [time] [unit]',
        english: '[time] [unit] ago',
    },
    'yesterdayAt': {
        german: 'Gestern um',
        english: 'Yesterday at',
    },
    'tomorrowAt': {
        german: 'Morgen um',
        english: 'Tomorrow at',
    },
    'last': {
        german: 'Letzter',
        english: 'Last',
    },
    'thisWeekdayAtTime': {
        german: 'Dieser [weekday] um [time]',
        english: 'This [weekday] at [time]',
    },
    'onMonthDayAtTime': {
        german: 'Am  [day]. [month] [year] um [time]',
        english: 'On [month] [day] at [time]',
    },
}