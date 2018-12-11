import moment from 'moment-timezone';

let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function parseDate(val) {
  let momentDate;

  if (typeof val === 'string') {
    momentDate = moment(String(val)).tz(timeZone);
  } else if (val.toString().length === 10) {
    momentDate = moment.unix(String(val)).tz(timeZone);
  } else {
    momentDate = moment(val).tz(timeZone);
  }

  return momentDate;
}
