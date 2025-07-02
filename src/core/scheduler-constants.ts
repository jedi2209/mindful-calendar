import moment from 'moment';
import 'moment-timezone';

// Настройка момента
moment.tz.setDefault('Europe/Madrid');
moment.locale('en-GB', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
});

export const getCurrentDate = (): moment.Moment => {
  let today = moment();
  if (today.day() === 0) {
    today = today.add(1, 'days');
  }
  return today;
};

export const SCHEDULER_CONFIG = {
  DEFAULT_START_HOUR: 9,
  DEFAULT_END_HOUR: 21,
  CELL_DURATION: 30,
  MOBILE_BREAKPOINT: 800,
  FIRST_DAY_OF_WEEK: 1,
  LOCALE: 'en-GB'
} as const;

export const GROUPING = [{
  resourceName: 'appointmentType',
}];

export const PREFIX = 'mindful';

export const CLASSES = {
  dayScaleCell: `${PREFIX}-dayScaleCell`,
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
  firstRoom: `${PREFIX}-firstRoom`,
  secondRoom: `${PREFIX}-secondRoom`,
  thirdRoom: `${PREFIX}-thirdRoom`,
  header: `${PREFIX}-header`,
  commandButton: `${PREFIX}-commandButton`,
} as const; 