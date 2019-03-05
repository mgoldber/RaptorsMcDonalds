import moment from 'moment';

export const PRESENTDAYFORMATTED = moment().format(`YYYY-MM-DD`);
export const YESTERDAYFORMATTED = moment().subtract(1, 'day').endOf('day').format(`YYYY-MM-DD`);
export const TOMORROWFORMATTED = moment().add(1, 'day').endOf('day').format(`YYYY-MM-DD`);
export const DAYAFTERTOMORROWFORMATTED = moment().add(2, 'day').endOf('day').format(`YYYY-MM-DD`);

export default { PRESENTDAYFORMATTED, YESTERDAYFORMATTED, TOMORROWFORMATTED }