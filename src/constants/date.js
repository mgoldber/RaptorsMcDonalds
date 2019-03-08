import moment from 'moment';

export const PRESENTDAYFORMATTED = moment().format(`YYYY-MM-DD`);
export const YESTERDAYFORMATTED = moment().subtract(1, 'day').endOf('day').format(`YYYY-MM-DD`);
export const TOMORROWFORMATTED = moment().add(1, 'day').endOf('day').format(`YYYY-MM-DD`);
export const DAYAFTERTOMORROWFORMATTED = moment().add(2, 'day').endOf('day').format(`YYYY-MM-DD`);
export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"]


export default { PRESENTDAYFORMATTED, YESTERDAYFORMATTED, TOMORROWFORMATTED, MONTHS }