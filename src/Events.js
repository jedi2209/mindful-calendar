import {get} from 'lodash';
import moment from 'moment';
import {apiCall} from './core/api';
import {getCache, setCache} from './core/cache';

import {colors} from './core/const';

/**
 * Object containing links to teacher timetables.
 * @type {Object.<number, string>}
 */
const teacherLinks = {
  8874199: 'https://mindful-studio.com/timetable/anna',
  9175210: 'https://mindful-studio.com/timetable/sara',
  9684621: 'https://mindful-studio.com/timetable/olgastas-belovidov',
};

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns {Array} An array of events.
 */
const getEventsOld = async() => {
  const classes = await apiCall('/availability/classes');
  if (get(classes, 'length') > 0) {
    let eventsTmp = [];
    let tmp = {};
    classes.map((el, indx) => {
      const date = moment(get(el, 'time'));
      tmp[get(el, 'appointmentTypeID')] = el;
      eventsTmp.push({
        id: indx,
        // name: get(el, 'name'),
        title: get(el, 'name'),
        description: get(el, 'description'),
        start: date.toDate(),
        end: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        originalData: el,
      });
    });
    return eventsTmp;
  }
}

/**
 * Retrieves the list of teachers from the API.
 * @returns {Promise<Array>} The list of teachers.
 */
const getTeachers = async () => {
  const CACHE_KEY = 'teachersCache';
  const cachedEvents = getCache(CACHE_KEY);
  if (cachedEvents) {
    return cachedEvents;
  }

  const calendars = await apiCall('/calendars');
  console.info('calendars', calendars);
  if (get(calendars, 'length') > 0) {
    let calendarsTmp = [];
    calendars.map(el => {
      calendarsTmp.push({
        id: get(el, 'id'),
        name: get(el, 'name'),
        text: get(el, 'name'),
        img: get(el, 'image'),
        link: teacherLinks[get(el, 'id')],
        color: colors[get(el, 'id')],
      });
    });

    // Update cache
    setCache(CACHE_KEY, calendarsTmp);

    return calendarsTmp;
  }
}

/**
 * Retrieves the appointment types from the API.
 * @returns {Promise<Array<Object>>} The array of appointment types.
 */
const getAppointmentTypes = async () => {
  const types = await apiCall('/appointment-types');
  if (get(types, 'length') > 0) {
    let typesTmp = [];
    types.map(el => {
      typesTmp.push({
        id: get(el, 'id'),
        name: get(el, 'name'),
        text: get(el, 'name'),
        color: get(el, 'color'),
        img: get(el, 'image'),
        link: get(el, 'schedulingUrl'),
      });
    });
    return typesTmp;
  }
}

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns {Array} An array of events in the standardized format.
 */
const getEvents = async () => {
  const CACHE_KEY = 'eventsCache';
  const cachedEvents = getCache(CACHE_KEY);
  if (cachedEvents) {
    return cachedEvents;
  }

  const classes = await apiCall('/availability/classes');
  console.info('classes', classes);
  if (get(classes, 'length') > 0) {
    let eventsTmp = [];
    classes.map((el, indx) => {
      const date = moment(get(el, 'time'));
      eventsTmp.push({
        id: indx,
        title: get(el, 'name'),
        startDate: date.toDate(),
        endDate: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        location: 'Main Room',
        appointmentType: get(el, 'appointmentTypeID'),
        teachers: [get(el, 'calendarID')],
        originalData: el,
      });
    });

    // Update cache
    setCache(CACHE_KEY, eventsTmp);

    return eventsTmp;
  }

  return [];
};

export {getTeachers, getEventsOld, getAppointmentTypes, getEvents};