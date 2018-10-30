import moment from 'moment';
import _ from 'lodash';

const UTCFormat = 'YYYY-MM-DDTHH:mmZZ';

// HINT: You probably want to use toLocalFromUTC({utcDate: '', format: ''})

//Converts UTC date time to local and local to UTC date time
const DateFormat = {
    toLocalDate: (date, format) => {
        let newDate = moment(new Date(date));

        if (format) {
            newDate = newDate.format(format);
        } else {
            newDate = newDate.format('YYYY-MM-DD');
        }

        return newDate;
    },
    toLocalTime: function(date) {
        const today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
            dateObj = moment.utc(date),
            dateObj00 = moment(dateObj).local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        return moment(today + dateObj - dateObj00).toDate();
    },
    toLocalDateTime: function(date, format) {
        if (!format) {
            format = 'YYYY-MM-DDTHH:mm'
        }
        return moment(new Date(date)).format(format)
    },

    toUTC: function(date, format) {
        if (!format) {
            format = UTCFormat
        }
        return moment(date).utc().format(format)
    },

    toUTCAdjusted: function(params) {
        let { date, format, amount, type, method } = params;

        if (!format) {
            format = UTCFormat
        }

        let utcDate = moment(date).utc();

        try {
            utcDate = utcDate[method](amount, type).format(format)
        } catch(e) {
            let errorMessage = '';
            if (!_.has(params, ['amount', 'type', 'method', 'date'])) {
                errorMessage = 'Missing params. Should have amount, type, method, and date'
            }
            this.handleError(e, errorMessage)
        }

        return utcDate
    },

    toLocalFromUTC: function(params) {
        let { utcDate, format, utcFormat } = params;

        let formattedUTCDate = '';

        if (!format) {
            format = 'YYYY-MM-DD'
        }

        if (utcFormat) {
            formattedUTCDate = moment(utcDate, utcFormat).format('YYYY-MM-DDTHH:mm');
        }

        if (formattedUTCDate === 'Invalid date' || formattedUTCDate === '') {
            formattedUTCDate = moment(utcDate.replace(/\+00:00$/,'')).format('YYYY-MM-DDTHH:mm');
        }

        let localDate = moment.utc(formattedUTCDate).local().format(format);

        return localDate
    },

    toLocalDateFromNow: function(date) {
        const datediff = moment(new Date(), 'YYYY-MM-DD').diff(moment(date, 'YYYY-MM-DD'), 'days');
        let dateString = '';
        if (datediff < 1)
            dateString = DateFormat.toLocalDateTime(date, 'h:mm a');
        else if (datediff == 1)
            dateString = 'Yesterday ' + DateFormat.toLocalDateTime(date, 'h:mm a');
        else
            dateString = DateFormat.toLocalDateTime(date, 'MMM DD, h:mm a');
        return dateString;
    },

    handleError(e, message) {
        console.log(message);
        console.log(e);
    }
}

export default DateFormat;
