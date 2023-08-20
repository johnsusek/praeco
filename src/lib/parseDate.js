import dayjs from 'dayjs';
import dayjs_advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs_relativeTime from 'dayjs/plugin/relativeTime';
import dayjs_timezone from 'dayjs/plugin/timezone';
import dayjs_utc from 'dayjs/plugin/utc';

dayjs.extend(dayjs_advancedFormat);
dayjs.extend(dayjs_relativeTime);
dayjs.extend(dayjs_timezone);
dayjs.extend(dayjs_utc);

let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function parseDate(val) {
  let momentDate;

  if (typeof val === 'string') {
    momentDate = dayjs(String(val)).tz(timeZone);
  } else if (val.toString().length === 10) {
    momentDate = dayjs.unix(String(val)).tz(timeZone);
  } else {
    momentDate = dayjs(val).tz(timeZone);
  }

  return momentDate;
}
